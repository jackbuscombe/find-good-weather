import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";

export const attractionsRouter = createRouter().query("getRestaurantsNearCoordinates", {
	input: z.object({
		lat: z.number(),
		long: z.number(),
	}),
	async resolve({ input }) {
		try {
			const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${input.lat}%2C${input.long}&radius=1500&type=tourist_attraction&key=${process.env.GOOGLE_MAPS_API}`);
			const results = response.data.results;

			console.log("Attraction results", results);
			const attractionsArray = [];
			let photoUrl = "";

			for (let i = 0; i < results.length; i++) {
				if (results[i].business_status === "OPERATIONAL") {
					// Get Place Image
					console.log("Photo Ref", results?.[i]?.photos?.[0]?.photo_reference);
					if (!!results?.[i]?.photos?.[0]?.photo_reference) {
						const photoResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${results[i].photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API}`);
						photoUrl = photoResponse.request.res.responseUrl;
					} else {
						photoUrl = "";
					}

					attractionsArray.push({
						name: results?.[i]?.name ?? "",
						rating: results?.[i]?.rating ?? 0,
						userRatingsTotal: results?.[i]?.user_ratings_total ?? 0,
						placeId: results?.[i]?.place_id ?? "",
						photo: photoUrl ?? "",
						lat: results?.[i]?.geometry?.location?.lat ?? 0,
						long: results?.[i]?.geometry?.location?.lng ?? 0,
						vicinity: results?.[i]?.vicinity ?? "",
					});
				}
			}
			console.log("attractionsArray array", attractionsArray);
			return attractionsArray;
		} catch (error) {
			console.log("Error fetching restaurants", error);
		}
	},
});
