import { Table } from "@mantine/core";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { useStore } from "../components/appStore";
import { toast } from "react-hot-toast";
import { LineWobble } from "@uiball/loaders";
import TableRow from "./TableRow";
import { trpc } from "../utils/trpc";

type RowData = {
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
		sunrise: number;
		sunset: number;
		timezone: number;
	};
	cnt: number;
	cod: string;
	list: {
		clouds: {
			all: number;
		};
		dt: number;
		dt_txt: string;
		main: {
			feels_like: number;
			grnd_level: number;
			humidity: number;
			pressure: number;
			sea_level: number;
			temp: number;
			temp_kf: number;
			temp_max: number;
			temp_min: number;
		};
		pop: number;
		sys: {
			pod: string;
		};
		weather: {
			description: string;
			icon: string;
			id: number;
			main: string;
		}[];
		wind: {
			deg: number;
			gust: number;
			speed: number;
		};
	}[];
	message: number;
};

function ResultsTable() {
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const userCity = useStore((state) => state.userCity);
	const userWeather = useStore((state) => state.userWeather);
	const userTemp = useStore((state) => state.userTemp);
	const setUserCity = useStore((state) => state.setUserCity);
	const setUserWeather = useStore((state) => state.setUserWeather);
	const setUserTemp = useStore((state) => state.setUserTemp);
	const [rowData, setRowData] = useState<RowData>();
	const { isLoading, data: forecast } = trpc.useQuery(["forecast.getForecast", { latitude: userLat, longitude: userLong }], {
		enabled: userLat != 0 && userLong != 0,
	});

	useEffect(() => {
		if (!forecast) return;
		console.log("The Forecast is", forecast);
		setUserCity(forecast.city.name);
		setUserWeather(forecast.list[0].weather[0].description);
		setUserTemp(forecast.list[0].main.temp);
	}, [forecast]);

	// const [weatherCell, setWeatherCell] = useState({});
	const locations = [
		{
			location: "Lyon",
			travelTime: 12.011,
			weather: rowData?.list.map((time) => {
				time.dt_txt;
			}),
			url: "/",
		},
		{ location: "Prague", travelTime: 14.007, weather: "Sunny", url: "/" },
		{ location: "Berlin", travelTime: 88.906, weather: "Sunny", url: "/" },
		{ location: "Paris", travelTime: 137.33, weather: "Rainy", url: "/" },
		{ location: "Kyiv", travelTime: 140.12, weather: "Rainy", url: "/" },
	];

	const rows = locations.map((location) => (
		<tr key={location.location}>
			<TableRow />
		</tr>
	));

	const weatherCell = rowData?.list.map((time) => ({
		timestamp: time.dt,
		temp: time.main.temp,
		weather: time.weather[0]?.description,
	}));

	return (
		<Table striped highlightOnHover verticalSpacing="md">
			<thead>
				<tr>
					<th>Location</th>
					<th>Time to travel</th>
					<th>Weather guess based on history</th>
					<th>Book</th>
				</tr>
			</thead>
			<tbody>
				{isLoading && (
					<tr>
						<td colSpan={4} align="center">
							<LineWobble color="#231F20" />
						</td>
					</tr>
				)}
				<tr key={userCity} className="bg-yellow-200">
					<td>{userCity}</td>
					<td>{100}</td>
					<td>{userWeather}</td>
					<td>
						<Link href={"/"}>
							<a className="bg-blue-500 text-white font-bold p-3 rounded-sm">Book</a>
						</Link>
					</td>
				</tr>
				{rows}
			</tbody>
		</Table>
	);
}
export default ResultsTable;
