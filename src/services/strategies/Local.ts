import { Strategy } from "passport-local";
import { PassportStatic } from "passport";

import User from "../../models/User";
import Log from "../../middlewares/Log";

class Local {
	public static init(passport: PassportStatic): any {
		passport.use(
			new Strategy(
				{ usernameField: "email", session: false },
				(email, password, done) => {
					// Log.info(`email is ${email}`);
					// Log.info(`password is ${password}`);

					User.findOne({ email }, async (err: any, user: any) => {
						let isAuthenticated;

						if (err) {
							return done(err);
						}

						if (!user) {
							return done(null, false, {
								message: `Email ${email} not found.`,
							});
						}

						/* if (!user.hash || !user.salt) {
							Log.info(JSON.stringify(user, null, 4));
							Log.info(` no user password`);
							return done(null, false, {
								message: `Email ${email} was not registered with us using any password. Please use the appropriate provider to Log-In again!`,
							});
						} */

						// Verify Password
						isAuthenticated = await user.authenticate(password);

						return done(null, isAuthenticated.user);
					});
				}
			)
		);
	}
}

export default Local;
