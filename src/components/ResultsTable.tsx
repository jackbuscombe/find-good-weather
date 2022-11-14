import axios from "axios";
import { trpc } from "../utils/trpc";
import { useStore } from "./appStore";
import CityResultVertical from "./CityResultVertical";
import { useEffect, useState } from "react";
import coordinatesToISO from "../utils/coordinatesToISO";

export type CityResult = {
	cityName: string;
	countryName: string;
	distance: number;
	lat: number;
	long: number;
	population: number;
	imageUrl: string;
	flightTime: number;
	transportTime: number;
	driveTime: number;
	weatherData: number[];
	isUserHere: boolean;
	cityId: string;
};

type Props = {
	tableData: CityResult[];
	pageNumber: number;
};

const additionalResults = [
	{
		cityName: "Bangkok",
		countryName: "Thailand",
		distance: 100000,
		lat: 13.7563,
		long: 100.5018,
		population: 0,
		imageUrl: "",
		flightTime: 0,
		transportTime: 0,
		driveTime: 0,
		weatherData: [],
		isUserHere: false,
		cityId: "1",
	},
	{
		cityName: "New York",
		countryName: "United States of America",
		distance: 100000,
		lat: 40.7128,
		long: 74.006,
		population: 0,
		imageUrl: "",
		flightTime: 0,
		transportTime: 0,
		driveTime: 0,
		weatherData: [],
		isUserHere: false,
		cityId: "1",
	},
	{
		cityName: "Amsterdam",
		countryName: "Netherlands",
		distance: 100000,
		lat: 52.3676,
		long: 4.9041,
		population: 0,
		imageUrl: "",
		flightTime: 0,
		transportTime: 0,
		driveTime: 0,
		weatherData: [],
		isUserHere: false,
		cityId: "1",
	},
];

function ResultsTable({ tableData, pageNumber }: Props) {
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const userCity = useStore((state) => state.userCity);
	const userCountry = useStore((state) => state.userCountry);
	const isViewingHome = useStore((state) => state.isViewingHome);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
			{/* <CityResultVertical cityId="Q60" cityName={userCity} countryName={userCountry} latitude={userLat} longitude={userLong} isUserHere={true} /> */}

			{tableData && tableData.slice(pageNumber, tableData.length - 1).map(({ cityId, cityName, countryName, lat, long, driveTime, flightTime, imageUrl, transportTime, isUserHere }, i) => <CityResultVertical key={cityName} cityId={cityId} cityName={cityName} latitude={lat} longitude={long} countryName={countryName} isUserHere={i == 0 && isViewingHome ? true : false} />)}
			{additionalResults && additionalResults.map(({ cityId, cityName, countryName, lat, long, driveTime, flightTime, imageUrl, transportTime, isUserHere }, i) => <CityResultVertical key={cityName} cityId={cityId} cityName={cityName} latitude={lat} longitude={long} countryName={countryName} isUserHere={false} />)}
		</div>
	);
}
export default ResultsTable;
