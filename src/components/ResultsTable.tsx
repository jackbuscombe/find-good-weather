import { Table } from "@mantine/core";
import Link from "next/link";

const locations = [
	{ location: "Lyon", travelTime: 12.011, weather: "Sunny", url: "/" },
	{ location: "Prague", travelTime: 14.007, weather: "Sunny", url: "/" },
	{ location: "Berlin", travelTime: 88.906, weather: "Sunny", url: "/" },
	{ location: "Paris", travelTime: 137.33, weather: "Rainy", url: "/" },
	{ location: "Kyiv", travelTime: 140.12, weather: "Rainy", url: "/" },
];

function ResultsTable() {
	const rows = locations.map((location) => (
		<tr key={location.location}>
			<td>{location.location}</td>
			<td>{location.travelTime}</td>
			<td>{location.weather}</td>
			<td>
				<Link href={location.url}>
					<a className="bg-blue-500 text-white font-bold p-3 rounded-sm">Book</a>
				</Link>
			</td>
		</tr>
	));

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
			<tbody>{rows}</tbody>
		</Table>
	);
}
export default ResultsTable;
