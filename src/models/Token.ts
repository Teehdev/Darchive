import IToken from "../interfaces/models/token";
import mongoose from "../providers/Database";

export type TokenDocument = mongoose.Document & IToken;

export const TokenSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	kind: { type: String, required: true, enum: ["google", "local"] },
	code: { type: String, required: true },
	secret: { type: String },
	createdAt: { type: Date, default: Date.now },
	expiresAt: { type: Date },
});

const Token = mongoose.model<TokenDocument>("Token", TokenSchema);

export default Token;
