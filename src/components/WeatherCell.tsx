import { Button, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RiSunCloudyFill } from "react-icons/ri";
import { useStore } from "./appStore";
import { WeatherObject } from "../types";

function WeatherCell({ temp, tempMin, tempMax, feelsLike, humidity, windSpeed, description, icon, timestamp }: WeatherObject) {
	const [opened, { close, open }] = useDisclosure(false);
	const celsius = useStore((state) => state.celsius);
	const setCelsius = useStore((state) => state.setCelsius);

	return (
		<>
			<Popover width={200} position="bottom" withArrow shadow="md" opened={opened}>
				<Popover.Target>
					<div onMouseEnter={open} onMouseLeave={close} className="flex flex-col items-center space-y-2 bg-gray-100 shadow rounded p-2 my-2 cursor-pointer hover:bg-gray-200">
						<p className="font-light">{new Date(timestamp * 1000).toDateString()}</p>
						<div className="flex justify-center items-center space-x-2">
							<img src={icon} alt={description} className="h-12 w-12" />
							<div>
								<p className="text-lg text-black font-bold">{`${temp.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
								<p className="text-gray-500">{description}</p>
							</div>
						</div>
					</div>
				</Popover.Target>
				<Popover.Dropdown sx={{ pointerEvents: "none", backgroundColor: "#fafafa", zIndex: "auto" }}>
					<div className="flex flex-col space-y-2 z-50">
						<p className="font-extrabold text-center">{new Date(timestamp * 1000).toDateString()}</p>

						<div className="flex justify-center items-center space-x-4 mb-2">
							<img src={icon} alt={description} className="h-12 w-12" />

							<div>
								<p className="text-lg text-black font-bold">{`${temp.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
								<p className="text-gray-500">{description}</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex justify-between">
								<p className="text-gray-500">Feels Like</p>
								<p className="text-black font-bold">{`${feelsLike.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-500">Min Temp</p>
								<p className="text-black font-bold">{`${tempMin.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-500">Max Temp</p>
								<p className="text-black font-bold">{`${tempMax.toFixed(0)}${celsius ? "°C" : "°F"}`}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-500">Humidity</p>
								<p className="text-black font-bold">{humidity}%</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-500">Wind Speed</p>
								<p className="text-black font-bold">{windSpeed.toFixed(0)}km/h</p>
							</div>
						</div>
					</div>
				</Popover.Dropdown>
			</Popover>
		</>
	);
}
export default WeatherCell;
