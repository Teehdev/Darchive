import Redis, { RedisOptions, Redis as IRedis } from "ioredis";

import Locals from "../providers/Locals";

class RedisService {
	private static instance: RedisService;

	port = Locals.config().redisPort;

	host = Locals.config().redisHost;

	password = Locals.config().redisPassword;

	options: RedisOptions = {
		enableReadyCheck: false, // Bull forcibly assumes Redis is ready if it has connected to it
		maxRetriesPerRequest: null, // Set to null to force each redis command to wait forever until connection is alive again (old pre-ioredis v4 behavior)
		password: this.password,
	};

	client: IRedis = new Redis(this.port, this.host, this.options);

	subscriber: IRedis = new Redis(this.port, this.host, this.options);

	defaultClient: IRedis = new Redis(this.port, this.host, this.options);

	constructor() {
		this.getBullOptions();
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new RedisService();
		}
		return this.instance;
	}

	getRedis() {
		return Redis;
	}

	getBullOptions() {
		const _this = this;
		return {
			createClient(type?: string) {
				switch (type) {
					case "client":
						return _this.client;

					case "subscriber":
						return _this.subscriber;

					default:
						return new Redis(_this.port, _this.host, _this.options);
				}
			},
		};
	}
}

export default RedisService;
