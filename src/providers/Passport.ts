/**
 * Enables the CORS
 *
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 */

import { Application, Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import { IAuthenticatedSocket } from "./WebSocket";
import passport from "passport";
import jwt from "jsonwebtoken";

import LocalStrategy from "../services/strategies/Local";
import JwtStrategy from "../services/strategies/JWT";
// import GoogleStrategy from "../services/strategies/Google";
import RedisService from "../services/Redis";

import User from "../models/User";
import Locals from "./Locals";
import Log from "../middlewares/Log";

class Passport {
	private static redisClient = RedisService.getInstance()
		.getBullOptions()
		.createClient();

	public mountPackage(app: Application): Application {
		app = app.use(passport.initialize());
		// app = app.use(passport.session());

		passport.serializeUser((user: any, done) => {
			done(null, user._id);
		});

		/* passport.deserializeUser((id, done) => {
       User.findById(id, "-salt -password -hash", (err: any, user: any) => {
         done(err, user);
       });
     }); */

		this.mountLocalStrategy();

		return app;
	}

	public mountLocalStrategy(): void {
		try {
			LocalStrategy.init(passport);
			// GoogleStrategy.init(passport);
			JwtStrategy.init(passport);
		} catch (error) {
			Log.error(`${error}`);
		}
	}

	public isAuthenticated(req: Request, res: Response, next: NextFunction) {
		// const refreshToken = req.headers.refreshToken;
		// const accessToken = req.headers.accessToken;

		// if (/* !refreshToken ||  */ !accessToken) {
		// 	return res.status(401).json({
		// 		message: "No Credential",
		// 	});
		// }

		passport.authenticate(
			"jwt",
			{ session: false },
			async (err, jwtPayload, info) => {
				if (err) {
					return res.status(401).json({
						message: "Bad Credential",
					});
				}

				if (!jwtPayload) {
					return res.status(401).json({
						message: "Please Sign in your account",
					});
				}

				// Check if access token has expired
				if (jwtPayload && jwtPayload.tokenStatus === "access_token_expired") {
					let redisUser;

					if (jwtPayload.count > 1) {
						return res.status(401).json({
							message: "Bad Token Credential: count",
						});
					}

					try {
						redisUser = await Passport.redisClient.get(jwtPayload.userRef);
					} catch (error) {
						Log.error(`${error}`);
					}

					if (redisUser) {
						redisUser = JSON.parse(redisUser);
					} else {
						return res.status(401).json({
							message: "Bad Token Credential",
						});
					}

					// Check to make sure refreshToken from client is the same as the user's refresh token in redisUser
					if (redisUser.refreshToken !== jwtPayload.refreshToken) {
						return res.status(401).json({
							message: "Bad Token Credential",
						});
					}

					// Check if refresh token saved in redisDB has expired
					if (redisUser.expiresAt < Date.now() / 1000) {
						return res.status(401).json({
							message: "Expired Token Credential",
						});
					}

					const newAccessToken = jwt.sign(
						{
							count: jwtPayload.count,
							refreshToken: jwtPayload.refreshToken,
							userRef: jwtPayload.userRef,
							userType: jwtPayload.type,
							role: jwtPayload.role,
							staffRef: jwtPayload.staffRef,
							partnerRef: jwtPayload.partnerRef,
							driverRef: jwtPayload.driverRef,
							adminRef: jwtPayload.adminRef,
						},
						Locals.config().jwtAccessSecret,
						{ expiresIn: Locals.config().accessJwtExpiresIn }
					);

					// res.header("accessToken", newAccessToken);
					res.header("Authorization", `Bearer ${newAccessToken}`);
				}

				res.locals.user = jwtPayload;
				next();
			}
		)(req, res, next);
	}

	public isSocketAuthenticated(socket: any, next: any) {
		// const refreshToken = socket.handshake.auth.refreshToken;
		// const accessToken = socket.handshake.auth.accessToken;

		// if (/* !refreshToken || */ !accessToken) {
		// 	return next(new Error("No Credential"));
		// }

		passport.authenticate(
			"jwt",
			{ session: false },
			async (err, jwtPayload, info) => {
				if (err) {
					return next(new Error("Bad Credential"));
				}

				if (!jwtPayload) {
					return next(new Error("Bad Credential"));
				}

				// Check if access token has expired
				if (jwtPayload && jwtPayload.tokenStatus === "access_token_expired") {
					let redisUser;

					if (jwtPayload.count > 1) {
						next(new Error("Bad Token Credential: count"));
					}

					try {
						redisUser = await Passport.redisClient.get(jwtPayload.userRef);
					} catch (error) {
						Log.error(`${error}`);
					}

					if (redisUser) {
						redisUser = JSON.parse(redisUser);
					} else {
						return next(new Error("Bad Token Credential"));
					}

					// Check to make sure refreshToken from client is the same as the user's refresh token in redisUser
					if (redisUser.refreshToken !== jwtPayload.refreshToken) {
						return next(new Error("Bad Token Credential"));
					}

					// Check if refresh token saved in redisDB has expired
					if (redisUser.expiresAt < Date.now() / 1000) {
						return next(new Error("Expired Token Credential"));
					}

					const newAccessToken = jwt.sign(
						{
							count: jwtPayload.count++,
							refreshToken: jwtPayload.refreshToken,
							userRef: jwtPayload.userRef,
							userType: jwtPayload.type,
							role: jwtPayload.role,
							staffRef: jwtPayload.staffRef,
							partnerRef: jwtPayload.partnerRef,
							driverRef: jwtPayload.driverRef,
							adminRef: jwtPayload.adminRef,
						},
						Locals.config().jwtAccessSecret,
						{ expiresIn: Locals.config().accessJwtExpiresIn }
					);

					socket.handshake.auth.accessToken = newAccessToken;
				}

				socket.request.user = jwtPayload;
				next();
			}
		)(socket, next);
	}
}

export default new Passport();
