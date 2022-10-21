import axios from "axios";
import dotenv from "dotenv"

export const FetchForms = ({ url, token }: { url: string, token: string }): Promise<any> => {
	dotenv.config();

	const requestUrl = `${url}/api/v1/forms`;

	return axios.get(
		requestUrl,
		{
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Token ${token}`
			}
		}
	).then((response) => {
		return response
	})
}

export const FetchFormMetadata = ({ url, token, formId }: { url: string, token: string, formId: number }): Promise<any> => {
	dotenv.config();

	const requestUrl = `${url}/api/v1/forms/${formId}`;

	return axios.get(
		requestUrl,
		{
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Token ${token}`
			}
		}
	).then((response) => {
		return response
	})
}

export const FetchFormData = async ({ url, token, formId }: { url: string, token: string, formId: number }): Promise<any> => {
	dotenv.config();

	const requestUrl = `${url}/api/v1/data/${formId}.csv`;

	return axios.get(
		requestUrl,
		{
			headers: {
				"Authorization": `Token ${token}`
			}
		}
	).then((response) => {
		return response
	})
}

export const GetApiToken = async ({ url, username, password }: { url: string, username: string, password: string }): Promise<any> => {
	dotenv.config();

	const requestUrl = `${url}/token/?format=json`;

	return axios.get(
		requestUrl,
		{
			auth: {
				username,
				password
			},
			headers: {
				"Content-Type": "application/json",
			}
		}
	).then((response) => {
		return response
	})
}