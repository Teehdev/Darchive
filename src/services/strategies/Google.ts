import { Strategy } from "passport-google-oauth20";

import User, { IUserModel } from "../../models/User";
import Token from "../../models/Token";
import Locals from "../../providers/Locals";

class Google {
	public static init(passport: any): any {
		passport.use(
			new Strategy(
				{
					clientID: process.env.GOOGLE_ID || "",
					clientSecret: process.env.GOOGLE_SECRET || "",
					callbackURL: `${Locals.config().url}/auth/google/callback`,
					passReqToCallback: true,
				},
				(req: any, accessToken, refreshToken, profile: any, done) => {
					if (req.user) {
						User.findOne(
							{ googleRef: profile.id },
							(err: any, existingUser: any) => {
								if (err) {
									return done(err);
								}

								if (existingUser) {
									return done(err);
								}

								User.findById(
									req?.user?.id,
									async (err: any, user: IUserModel): Promise<void> => {
										if (err) {
											return done(err);
										}

										user.googleRef = profile.id;
										user.name = user.name || profile.displayName.split(" ")[0];
										/** 	user.lastname =
											user.lastname || profile.displayName.split(" ")[1];
											*/

										if (profile.photos) {
											// create a media document with user's google profile photo
										}

										const token = new Token();

										token.code = accessToken;
										token.kind = "google";

										try {
											await token.save();
											await user.save();
										} catch (err: any) {
											return done(err, user);
										}
									}
								);
							}
						);
					} else {
						User.findOne(
							{ google: profile.id },
							(err: any, existingUser: any) => {
								if (err) {
									return done(err);
								}

								if (existingUser) {
									return done(null, existingUser);
								}

								User.findOne(
									{ email: profile.emails[0].value },
									async (err: any, existingEmailUser: any) => {
										if (err) {
											return done(err);
										}

										if (existingEmailUser) {
											return done(err);
										}

										const user = new User();
										const token = new Token();

										user.email = profile.emails[0].value;
										user.googleRef = profile.id;
										user.name = user.name || profile.displayName.split(" ")[0];
										/**	user.lastname =
											user.lastname || profile.displayName.split(" ")[1];
											 */

										if (profile.photos) {
											// create a media document with user's google profile photo
										}

										token.code = accessToken;
										token.kind = "google";

										try {
											await token.save();
											await user.save();
										} catch (err: any) {
											return done(err, user);
										}
									}
								);
							}
						);
					}
				}
			)
		);
	}
}

export default Google;
