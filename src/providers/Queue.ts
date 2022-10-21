import BullQueue, {
	Queue,
	JobOptions,
	JobId,
	ProcessPromiseFunction,
} from "bull";
import EventEmitter from "events";

import RedisService from "../services/Redis";
import Log from "../middlewares/Log";

EventEmitter.defaultMaxListeners = 50;

type jobOpts = JobOptions & {
	data: object;
	name?: string;
	concurrency?: number;
};

class QueueProvider {
	public jobs: Queue;

	constructor(name: string) {
		this.jobs = new BullQueue(
			name,
			RedisService.getInstance().getBullOptions()
		);

		this.jobs
			.on("progress", (job, progress) => {
				Log.info(`Started processing ${job.name}`);
			})
			.on("completed", async (job, result) => {
				Log.info(
					`Completed ${job.name} with ${result} status will be removed now`
				);
				await this.removeProcessedJob(job.id);
			});
	}

	public dispatch(
		name: string,
		opts: jobOpts,
		cb: ProcessPromiseFunction<void>
	): void {
		this.jobs.add(name, opts?.data, opts);

		this.process(cb, opts?.concurrency, opts?.name);
	}

	private async removeProcessedJob(id: JobId): Promise<void> {
		const job = await this.jobs.getJob(id);

		await job?.remove();
	}

	public process(
		processor: ProcessPromiseFunction<void>,
		concurrency?: number,
		name?: string
	) {
		if (name && concurrency) {
			this.jobs.process(name, concurrency, processor);
		} else if (name && !concurrency) {
			this.jobs.process(name, processor);
		} else if (!name && concurrency) {
			this.jobs.process(concurrency, processor);
		} else {
			this.jobs.process(processor);
		}
	}
}

export default QueueProvider;
