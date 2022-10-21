import { Strategy, ExtractJwt } from "passport-jwt";

import Locals from "../../providers/Locals";
import Log from "../../middlewares/Log";

class Jwt {
	public static init(passport: any): any {
		passport.use(
			new Strategy(
				{
					jwtFromRequest: ExtractJwt.fromExtractors([
						(req: any) => {
							return req.headers
								? req.headers.accessToken
								: req.handshake.auth.accessToken;
						},
						ExtractJwt.fromAuthHeaderAsBearerToken(),
					]),
					secretOrKey: Locals.config().jwtAccessSecret,
					ignoreExpiration: true,
				},
				async (jwtPayload, done) => {
					const expirationDate = new Date(jwtPayload.exp * 1000);

					if (expirationDate < new Date()) {
						return done(null, {
							tokenStatus: "access_token_expired",
							count: jwtPayload.count + 1,
							refreshToken: jwtPayload.refreshToken,
							userRef: jwtPayload.userRef,
							userType: jwtPayload.userType,
							role: jwtPayload.role,
							staffRef: jwtPayload.staffRef || null,
							partnerRef: jwtPayload.partnerRef || null,
							driverRef: jwtPayload.driverRef || null,
							adminRef: jwtPayload.adminRef || null,
						});
					}

					return done(null, {
						...jwtPayload,
						tokenStatus: "access_token_active",
					});
				}
			)
		);
	}
}

export default Jwt;
