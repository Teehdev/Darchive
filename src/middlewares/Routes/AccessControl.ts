/**
 * Define the Auth Middlewares
 *
 *  @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 */

import { Request, Response, NextFunction } from "express";
import { Event } from "socket.io";

import AccessControlProvider from "../../providers/AccessControl";
import Log from "../Log";

type SocketNextFunction = (err?: Error) => void;

class AccessControlMw {
	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum creation priviledge
	 * @param resources
	 * @returns middleware function
	 */
	public static canCreate(
		resources: string[],
		options?: { checkOnlyAny?: boolean }
	) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				let allowAny = false;
				let allowOwn = false;
				const role = res.locals.user.role;
				const acProvider = await AccessControlProvider;

				if (resources.length > 0) {
					resources.map((resource) => {
						if (acProvider.ac.can(role).createAny(resource).granted) {
							allowAny = true;
						}

						if (acProvider.ac.can(role).createOwn(resource).granted) {
							allowOwn = true;
						}
					});
				}

				if (options && options.checkOnlyAny) {
					if (!allowAny) {
						return res.status(401).json({
							message: "You don't have permission to perform action",
						});
					}
				} else {
					if (!allowAny && !allowOwn) {
						return res.status(401).json({
							message: "You don't have permission to perform action",
						});
					}
				}

				next();
			} catch (error) {
				next(error);
			}
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum creation priviledge for socket connection
	 * @param resources
	 * @returns middleware function
	 */
	public static socketioCanCreate(
		resources: string[],
		checkEvent: Event,
		socket: any,
		options?: { checkOnlyAny?: boolean }
	) {
		return async (event: Event, next: SocketNextFunction) => {
			if (checkEvent[0] === event[0]) {
				try {
					let allowAny = false;
					let allowOwn = false;
					const role = socket.request.user.role;
					const acProvider = await AccessControlProvider;

					if (resources.length > 0) {
						resources.map((resource) => {
							if (acProvider.ac.can(role).createAny(resource).granted) {
								allowAny = true;
							}

							if (acProvider.ac.can(role).createOwn(resource).granted) {
								allowOwn = true;
							}
						});
					}

					if (options && options.checkOnlyAny) {
						if (!allowAny) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					} else {
						if (!allowAny && !allowOwn) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					}

					return next();
				} catch (error: any) {
					return next(error);
				}
			}

			return next();
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum read priviledge
	 * @param resources
	 * @returns middleware function
	 */
	public static canRead(
		resources: string[],
		options?: { checkOnlyAny?: boolean }
	) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				let allowAny = false;
				let allowOwn = false;
				const role = res.locals.user.role;
				const acProvider = await AccessControlProvider;

				if (resources.length > 0) {
					resources.map((resource) => {
						if (acProvider.ac.can(role).readAny(resource).granted) {
							allowAny = true;
						}

						if (acProvider.ac.can(role).readOwn(resource).granted) {
							allowOwn = true;
						}
					});
				}

				if (options && options.checkOnlyAny) {
					if (!allowAny) {
						return res.status(401).json({
							message: "You don't have permission to perform action",
						});
					}
				} else {
					if (!allowAny && !allowOwn) {
						return res.status(401).json({
							message: "You don't have permission to perform action",
						});
					}
				}

				next();
			} catch (error) {
				next(error);
			}
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum read priviledge for socket connection
	 * @param resources
	 * @returns middleware function
	 */
	public static socketioCanRead(
		resources: string[],
		checkEvent: Event,
		socket: any,
		options?: { checkOnlyAny?: boolean }
	) {
		return async (event: Event, next: SocketNextFunction) => {
			if (checkEvent === event) {
				try {
					let allowAny = false;
					let allowOwn = false;
					const role = socket.request.user.role;
					const acProvider = await AccessControlProvider;

					if (resources.length > 0) {
						resources.map((resource) => {
							if (acProvider.ac.can(role).readAny(resource).granted) {
								allowAny = true;
							}

							if (acProvider.ac.can(role).readOwn(resource).granted) {
								allowOwn = true;
							}
						});
					}

					if (options && options.checkOnlyAny) {
						if (!allowAny) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					} else {
						if (!allowAny && !allowOwn) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					}

					return next();
				} catch (error: any) {
					return next(error);
				}
			}

			return next();
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum update priviledge
	 * @param resources
	 * @returns middleware function
	 */
	public static canUpdate(
		resources: string[],
		options?: { checkOnlyAny?: boolean }
	) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				let allowAny = false;
				let allowOwn = false;
				const role = res.locals.user.role;
				const acProvider = await AccessControlProvider;

				if (resources.length > 0) {
					resources.map((resource) => {
						if (acProvider.ac.can(role).updateAny(resource).granted) {
							allowAny = true;
						}

						if (acProvider.ac.can(role).updateOwn(resource).granted) {
							allowOwn = true;
						}
					});
				}

				if (options && options.checkOnlyAny) {
					if (!allowAny) {
						return res.status(401).json({
							message: "You don't have permission to perform action",
						});
					}
				} else {
					if (!allowAny && !allowOwn) {
						return res.status(401).json({
							message: "You don't have permission to perform action",
						});
					}
				}

				next();
			} catch (error) {
				next(error);
			}
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum update priviledge for socket connection
	 * @param resources
	 * @returns middleware function
	 */
	public static socketioCanUpdate(
		resources: string[],
		checkEvent: Event,
		socket: any,
		options?: { checkOnlyAny?: boolean }
	) {
		return async (event: Event, next: SocketNextFunction) => {
			if (checkEvent === event) {
				try {
					let allowAny = false;
					let allowOwn = false;
					const role = socket.request.user.role;
					const acProvider = await AccessControlProvider;

					if (resources.length > 0) {
						resources.map((resource) => {
							if (acProvider.ac.can(role).updateAny(resource).granted) {
								allowAny = true;
							}

							if (acProvider.ac.can(role).updateOwn(resource).granted) {
								allowOwn = true;
							}
						});
					}

					if (options && options.checkOnlyAny) {
						if (!allowAny) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					} else {
						if (!allowAny && !allowOwn) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					}

					return next();
				} catch (error: any) {
					return next(error);
				}
			}

			return next();
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum delete priviledge
	 * @param resources
	 * @returns middleware function
	 */
	public static canDelete(
		resources: string[],
		options?: { checkOnlyAny?: boolean }
	) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				let allowAny = false;
				let allowOwn = false;
				const role = res.locals.user.role;
				const acProvider = await AccessControlProvider;

				if (resources.length > 0) {
					resources.map((resource) => {
						if (acProvider.ac.can(role).deleteAny(resource).granted) {
							allowAny = true;
						}

						if (acProvider.ac.can(role).deleteOwn(resource).granted) {
							allowOwn = true;
						}
					});
				}

				if (options && options.checkOnlyAny) {
					if (!allowAny) {
						return Promise.reject({
							message:
								"You don't have enough permission to perform this action",
						});
					}
				} else {
					if (!allowAny && !allowOwn) {
						return Promise.reject({
							message:
								"You don't have enough permission to perform this action",
						});
					}
				}

				next();
			} catch (error) {
				next(error);
			}
		};
	}

	/**
	 * @description A wrapper method that returns a middleware function to check if a user has minimum read priviledge for socket connection
	 * @param resources
	 * @returns middleware function
	 */
	public static socketioCanDelete(
		resources: string[],
		checkEvent: Event,
		socket: any,
		options?: { checkOnlyAny?: boolean }
	) {
		return async (event: Event, next: SocketNextFunction) => {
			if (checkEvent === event) {
				try {
					let allowAny = false;
					let allowOwn = false;
					const role = socket.request.user.role;
					const acProvider = await AccessControlProvider;

					if (resources.length > 0) {
						resources.map((resource) => {
							if (acProvider.ac.can(role).deleteAny(resource).granted) {
								allowAny = true;
							}

							if (acProvider.ac.can(role).deleteOwn(resource).granted) {
								allowOwn = true;
							}
						});
					}

					if (options && options.checkOnlyAny) {
						if (!allowAny) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					} else {
						if (!allowAny && !allowOwn) {
							return next(
								new Error(
									"You don't have enough permission to perform this action"
								)
							);
						}
					}

					return next();
				} catch (error: any) {
					return next(error);
				}
			}

			return next();
		};
	}
}

export default AccessControlMw;
