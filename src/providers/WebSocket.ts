import { Server, Socket } from "socket.io";
import type { IncomingMessage } from "http";

import Express from "./Express";

interface IAuthenticatedRequest extends IncomingMessage {
	user: {
		count: number;
		refreshToken: string;
		userRef: string;
		userType: string;
		role: string;
		staffRef?: string;
		partnerRef?: string;
		driverRef?: string;
		adminRef?: string;
	};
}

export interface IAuthenticatedSocket extends Omit<Socket, "request"> {
	get request(): IAuthenticatedRequest;
}

class WebSocket {
	public io: Server;

	constructor() {
		this.io = new Server(Express.server);
	}
}

export default new WebSocket();
