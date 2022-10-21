/**
 * Define interface for Token Model
 *
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 */

type tokenKind = "google" | "local";

export interface IToken {
	user: string;
	kind: tokenKind;
	code: string;
	secret?: string;
	createdAt?: Date;
	expiresAt: Date;
}

export default IToken;
