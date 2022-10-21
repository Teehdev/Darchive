import axios from "axios";
import dotenv from "dotenv"

export const FetchAnalytics = (params: string) => {
	dotenv.config();

	const url = `${process.env.DHIS_URL}/29/analytics.csv?${params}`;

	return axios.get(
		url,
		{
			timeout: 60000,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${process.env.DHIS_AUTH}`
			}
		}
	).then((response) => {
		return response
	})
}

export const FetchIndicators = async ({ page }: { page?: number }) => {
	dotenv.config();

	let url = `${process.env.DHIS_URL}/indicators/`;
	if (page) {
		url += `?page=${page}`
	}

	return axios.get(
		url,
		{
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${process.env.DHIS_AUTH}`
			}
		}
	).then((response) => {
		return response
	})
}

export const FetchIndicator = async ({ id }: { id: string }) => {
	dotenv.config();

	return axios.get(
		`${process.env.DHIS_URL}/indicators/${id}`,
		{
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${process.env.DHIS_AUTH}`
			}
		}
	).then((response) => {
		return response
	})
}
