import { Request, Response, NextFunction } from "express";
import {
	// S3,
	PutObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
} from "@aws-sdk/client-s3";
import { S3 } from "aws-sdk";
import stream from "stream";
import multer from "multer";

import Locals from "../providers/Locals";
import Log from "../middlewares/Log";
import Gen from "../utils/Gen";

const storage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, '/uploads')
	},
	filename (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, file.fieldname + '-' + uniqueSuffix)
	}
})
class MediaService {
	private region = Locals.config().bucketRegion;

	private accessKeyId = Locals.config().bucketKey;

	private secretAccessKey = Locals.config().bucketSecret;

	constructor() {
		this.multerClient = this.multerClient.bind(this);
		this.parseRequest = this.parseRequest.bind(this);
		this.bufferToStream = this.bufferToStream.bind(this);
		this.uploadS3 = this.uploadS3.bind(this);
	}

	public multerClient = multer({
		storage,
		limits: { fileSize: 2 * 1024 * 1024 }, // Default limit is 2mb
		fileFilter: (req, file, cb) => {
			if (
				["image/jpeg", "image/png", "text/csv", "application/vnd.ms-excel", "application/msword", "application/pdf",
						"application/vnd.ms-powerpoint",
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						"application/vnd.openxmlformats-officedocument.presentationml.presentation"].includes(
					file.mimetype
				)
			) {
				cb(null, true);
			} else {
				cb(null, false);
				const err = new Error(
					"Only .csv, .png, .jpg, .jpeg and .pdf format allowed!"
				);
				err.name = "ExtensionError";

				return cb(err);
			}
		},
	}).any();

	public parseRequest(req: Request, res: Response, next: NextFunction) {
		this.multerClient(req, res, (err) => {
			try {
				if (err instanceof multer.MulterError) {
				Log.info(`<< Multer error while parsing request >>`);
				Log.error(`${err.message}`);
				return next(err);
			}

			if (err) {
				Log.info(`<< Unknown error while parsing request >>`);
				Log.error(`${err.message}`);
				return next(err);
			}


			} catch (error: any) {
				return res.status(400).json({message: error.message})
			}

			return next();

		});
	}

	private bufferToStream(buffer: any) {
		const { Duplex } = stream;
		const duplexStream = new Duplex();
		duplexStream.push(buffer);
		duplexStream.push(null);
		return duplexStream;
	}

	/**
	 * upload
	 */

	public upload = multer({ storage });

	public async uploadS3(bucket: string, file: any) {
		const Key = await Gen.generateFileKey();

		const s3 = new S3();

		const param = {
			Bucket: bucket,
			Key,
			Body: file.buffer,
			ContentType: file.type || file.mimetype,
			// ContentDisposition: "attachment",
			ContentLength: file.size,
		};

		return await s3.upload(param).promise();
	}
}

export default new MediaService();
