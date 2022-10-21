import { Application } from "express";
import * as dotenv from "dotenv";

type config = {
	url: string;
	port: string | number;
	csrfSecret: string;
	jwtAccessSecret: string;
	jwtRefreshSecret: string;
	mongoDBUri?: string;
	maxUploadLimit: string;
	maxParameterLimit: string | number;
	isCORSEnabled: boolean | string;
	accessJwtExpiresIn: string | number;
	refreshJwtExpiresIn: string | number;
	logDays: string | number;
	queueMonitor: boolean | string;
	queueMonitorHttpPort: string | number;
	redisPort: number;
	redisHost: string;
	redisPassword: string;
	companyName: string;
	companyDomain: string;
	topgymBucketEndpoint: string;
	topgymBucketSubdomainEndpoint: string;
	bucket: string;
	bucketSecret: string;
	bucketKey: string;
	bucketRegion: string;
	mailtrapUsername: string;
	mailtrapPassword: string;
	mailtrapHost: string;
	mailtrapPort: number;
	sendgridUsername: string;
	sendgridApiKey: string;
	sendgridHost: string;
	sendgridPort: number;
	baseRate: number;
	paystackSecretKeyTest: string;
	paystackSecretKeyLive: string;
	expoAccessToken: string;
	companyEmail: string;
};

class Locals {
	public static config(): config {
		dotenv.config();

		const url = process.env.APP_url || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 8080;
		const csrfSecret = process.env.CSRF_SECRET || "This is your responsibility";
		const jwtAccessSecret =
			process.env.JWT_ACCESS_SECRET || "This is your responsibility";
		const jwtRefreshSecret =
			process.env.JWT_REFRESH_SECRET || "This is your responsibility";
		const mongoDBUri =
			process.env.NOE_ENV === "development"
				? process.env.MONGO_TEST_DB_URI
				: process.env.MONGO_DB_URI;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || "30mb";
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || "5000";

		const isCORSEnabled = process.env.CORS_ENABLED || true;
		const accessJwtExpiresIn = process.env.ACCESS_JWT_EXPIRES_IN || "1800000"; // 30mins default
		const refreshJwtExpiresIn = process.env.REFRESH_JWT_EXPIRES_IN || "30 days"; // 30 days default

		const logDays = process.env.LOG_DAYS || 10;

		const queueMonitor = process.env.QUEUE_HTTP_ENABLED || true;
		const queueMonitorHttpPort = process.env.QUEUE_HTTP_PORT || 5550;

		const redisPort = Number(process.env.REDIS_PORT) || 6379;
		const redisHost = process.env.REDIS_HOST || "127.0.0.1";
		const redisPassword = process.env.REDIS_PASSWORD || "set your password";

		const companyName = process.env.COMPANY_NAME || "Topgym";
		const companyEmail =
			process.env.COMPANY_EMAIL || "thedigitalagencyltd@gmail.com";
		const companyDomain = process.env.COMPANY_DOMAIN || "";

		const bucketEndpoint = process.env.BUCKET_ENDPOINT || "";
		const topgymBucketEndpoint = process.env.TOPGYM_BUCKET_ENDPOINT || "";
		const topgymBucketSubdomainEndpoint =
			process.env.TOPGYM_BUCKET_SUBDOMAIN_ENDPOINT || "";
		const bucket = process.env.AWS_BUCKET_NAME || "";
		const bucketRegion = process.env.AWS_REGION || "";
		const bucketKey = process.env.AWS_ACCESS_KEY_ID || "";
		const bucketSecret = process.env.AWS_SECRET_ACCESS_KEY || "";

		const mailtrapUsername = process.env.MAILTRAP_USERNAME || "";
		const mailtrapPassword = process.env.MAILTRAP_PASSWORD || "";
		const mailtrapHost = process.env.MAILTRAP_HOST || "";
		const mailtrapPort = Number(process.env.MAILTRAP_PORT);

		const sendgridUsername = process.env.SENDGRID_USERNAME || "";
		const sendgridApiKey = process.env.SENDGRID_API_KEY || "";
		const sendgridHost = process.env.SENDGRID_HOST || "";
		const sendgridPort = Number(process.env.SENDGRID_PORT);

		const baseRate = Number(process.env.BASE_RATE) || 40000; // 400 Naira in  kobo

		const paystackSecretKeyLive = process.env.PAYSTACK_SECRET_KEY_LIVE || "";
		const paystackSecretKeyTest = process.env.PAYSTACK_SECRET_KEY_TEST || "";

		const expoAccessToken = process.env.EXPO_ACCESS_TOKEN || "";

		return {
			url,
			port,
			csrfSecret,
			jwtAccessSecret,
			jwtRefreshSecret,
			mongoDBUri,
			maxUploadLimit,
			maxParameterLimit,
			isCORSEnabled,
			accessJwtExpiresIn,
			refreshJwtExpiresIn,
			logDays,
			queueMonitor,
			queueMonitorHttpPort,
			redisPort,
			redisHost,
			redisPassword,
			topgymBucketEndpoint,
			topgymBucketSubdomainEndpoint,
			bucket,
			bucketSecret,
			bucketKey,
			bucketRegion,
			companyName,
			companyDomain,
			mailtrapUsername,
			mailtrapPassword,
			mailtrapHost,
			mailtrapPort,
			sendgridUsername,
			sendgridApiKey,
			sendgridHost,
			sendgridPort,
			baseRate,
			paystackSecretKeyTest,
			paystackSecretKeyLive,
			expoAccessToken,
			companyEmail,
		};
	}

	public static init(app: Application): Application {
		app.locals.app = this.config;
		return app;
	}
}

export default Locals;
