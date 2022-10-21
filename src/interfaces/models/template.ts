/**
 * Define interface for Template Model
 *
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 */


export interface ITemplate {
	name: string;
	fields: any;
	createdAt?: Date;
	createdBy: string;
}

export default ITemplate;
