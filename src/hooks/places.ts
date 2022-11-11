import coordinatesToISO from "../utils/coordinatesToISO";
import { trpc } from "../utils/trpc";

export const useGetCityFromLatLong = (userLat: number, userLong: number) => {
	return trpc.useQuery(["places.getCityFromLatLong", { lat: userLat, long: userLong }], {
		enabled: !!userLat && !!userLong,
		staleTime: Infinity,
		cacheTime: Infinity,
	});
};

export const useGetNearbyCities = (lat: number, long: number) => {
	return trpc.useQuery(["places.getNearbyCities", { isoCoords: coordinatesToISO(lat, long) }], {
		enabled: !!lat && !!long,
		staleTime: Infinity,
		cacheTime: Infinity,
	});
};
