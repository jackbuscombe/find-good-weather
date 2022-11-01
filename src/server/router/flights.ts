import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";

export const flightsRouter = createRouter().query("getForecast", {
	input: z.object({
		latitude: z.number(),
		longitude: z.number(),
	}),
	async resolve({ input }) {
		try {
			const options = {
				method: "GET",
				url: "https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v1/prices/cheap",
				params: { origin: "HKT", page: "None", currency: "RUB", destination: "-" },
				headers: {
					"X-Access-Token": process.env.TRAVEL_PAYOUTS_API_TOKEN as string,
					"X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY as string,
					"X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST_TRAVEL_PAYOUTS as string,
				},
			};

			const response = await axios.request(options);
			return response;
		} catch (error) {
			console.log("Error Fetching Forecast", error);
			return error;
		}
	},
});
