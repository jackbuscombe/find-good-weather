import axios from "axios";
import { trpc } from "../utils/trpc";
import { useStore } from "./appStore";
import CityResultVertical from "./CityResultVertical";
import { useEffect, useState } from "react";
import coordinatesToISO from "../utils/coordinatesToISO";

type Props = {
	tableData: {
		cityName: any;
		countryName: any;
		distance: any;
		lat: any;
		long: any;
		population: any;
		imageUrl: string;
		flightTime: number;
		transportTime: number;
		driveTime: number;
		weatherData: number[];
		isUserHere: boolean;
		cityId: string;
	}[];
};

function ResultsTable({ tableData }: Props) {
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const userCity = useStore((state) => state.userCity);
	const userCountry = useStore((state) => state.userCountry);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
			<CityResultVertical cityId="Q60" cityName={userCity} countryName={userCountry} latitude={userLat} longitude={userLong} isUserHere={true} />

			{tableData && tableData.map(({ cityId, cityName, countryName, lat, long, driveTime, flightTime, imageUrl, transportTime, isUserHere }) => <CityResultVertical key={cityName} cityId={cityId} cityName={cityName} latitude={lat} longitude={long} countryName={countryName} isUserHere={isUserHere} />)}
		</div>
	);
}
export default ResultsTable;
