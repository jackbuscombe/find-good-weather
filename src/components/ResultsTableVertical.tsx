import axios from "axios";
import { trpc } from "../utils/trpc";
import { useStore } from "./appStore";
import CityResultVertical from "./CityResultVertical";
import { useEffect, useState } from "react";
import coordinatesToISO from "../utils/coordinatesToISO";

const results = [
	{
		cityName: "Berlin",
		countryName: "Germany",
		imageUrl: "https://google.com",
		flightTime: 600,
		transportTime: 800,
		driveTime: 700,
		weatherData: [10, 20, 50, 90],
		isUserHere: false,
	},
	{
		cityName: "Phoenix",
		countryName: "USA",
		imageUrl: "https://google.com",
		flightTime: 600,
		transportTime: 800,
		driveTime: 700,
		weatherData: [10, 20, 50, 90],
	},
	{
		cityName: "Las Vegas",
		countryName: "USA",
		imageUrl: "https://google.com",
		flightTime: 600,
		transportTime: 800,
		driveTime: 700,
		weatherData: [10, 20, 50, 90],
	},
];

function ResultsTableVertical() {
	const userLat = useStore((state) => state.userLat);
	const setUserLat = useStore((state) => state.setUserLat);
	const userLong = useStore((state) => state.userLong);
	const setUserLong = useStore((state) => state.setUserLong);
	coordinatesToISO(userLat, userLong);

	const { isLoading: isLoadingNearbyCities, data: nearbyCities } = trpc.useQuery(["places.getNearbyCities", { isoCoords: coordinatesToISO(userLat, userLong) }], {
		enabled: !!userLat && !!userLong,
		staleTime: Infinity,
		cacheTime: Infinity,
	});

	const userCity = useStore((state) => state.userCity);
	const userCountry = useStore((state) => state.userCountry);
	const userFullLocationName = useStore((state) => state.userFullLocationName);

	// const { data: userCityBasicDetails, isLoading: isLoadingBasicDetails } = trpc.useQuery(["places.getPlaceBasicDetailsFromCityName", { cityName: userFullLocationName }], {
	// 	enabled: !!userCity,
	// 	staleTime: Infinity,
	// 	cacheTime: Infinity,
	// });

	return (
		<div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
			<CityResultVertical cityName={userCity} countryName={userCountry} latitude={userLat} longitude={userLong} isUserHere={true} />

			{nearbyCities && nearbyCities.map(({ cityName, countryName, lat, long, driveTime, flightTime, imageUrl, transportTime, isUserHere }, i) => <CityResultVertical key={cityName} cityName={cityName} latitude={lat} longitude={long} countryName={countryName} isUserHere={isUserHere} />)}
		</div>
	);
}
export default ResultsTableVertical;
