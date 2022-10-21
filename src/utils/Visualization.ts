export const validation = {
	isEmailAddress: (str: string) => {
		const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return pattern.test(str);  // returns a boolean
	},
	isNotEmpty: (str: string) => {
		const pattern = /\S+/;
		return pattern.test(str);  // returns a boolean
	},
	isNumber: (str: string) => {
		const pattern = /^(\d+\.\d+$)|(\d+.\d+%$)|(\d+)$/;
		return pattern.test(str);  // returns a boolean
	},
	isSame: (str1: string, str2: string) => {
		return str1 === str2;
	}
};
