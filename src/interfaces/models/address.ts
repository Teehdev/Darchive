export interface IAddress {
	country: string;
	state: string;
	locality?: string;
	street: string;
	suite?: string;
	zip?: string;
	landmark?: string;
}

export default IAddress;
