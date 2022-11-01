import Link from "next/link";
import { GiForwardSun } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useStore } from "../components/appStore";
import { trpc } from "../utils/trpc";
import SharingLinks from "./SharingLinks";
import { TbSun } from "react-icons/tb";
import { Switch } from "@mantine/core";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import SearchForm from "./SearchForm";

function Header() {
	const [currentLatitude, setCurrentLatitude] = useState<number>(0);
	const [currentLongitude, setCurrentLongitude] = useState<number>(0);
	const [userCityName, setUserCityName] = useState<string>("");
	const celsius = useStore((state) => state.celsius);
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const userCity = useStore((state) => state.userCity);
	const userWeather = useStore((state) => state.userWeather);
	const userTemp = useStore((state) => state.userTemp);
	const setCelsius = useStore((state) => state.setCelsius);
	const setUserLat = useStore((state) => state.setUserLat);
	const setUserLong = useStore((state) => state.setUserLong);
	const setUserCity = useStore((state) => state.setUserCity);
	const setUserWeather = useStore((state) => state.setUserWeather);
	const setUserTemp = useStore((state) => state.setUserTemp);

	useEffect(() => {
		if (!("geolocation" in navigator)) {
			setUserCityName("Geolocation not supported");
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setUserLat(position.coords.latitude);
				setUserLong(position.coords.longitude);
			},
			(error) => {
				toast.error("Please approve location permission - we do not save this data.");
			}
		);
	}, []);

	return (
		<header className="bg-[#445fc8] space-y-8 font-mono">
			<div className="w-full flex py-4 px-12 justify-between items-center">
				<Link href="/">
					<div className="flex items-center space-x-4 text-xl font-semibold cursor-pointer">
						<TbSun className="text-yellow-400 text-4xl" />
						<p className="text-white">Find good weather</p>
					</div>
				</Link>

				{/* <p className="text-white font-semibold">{`${userCity ?? "Current Location"}: ${userWeather} ${userTemp?.toFixed(0)}°C`}</p> */}
				<div className="flex space-x-16 text-white">
					<div className="flex items-center space-x-6">
						<p>Share social</p>
						<FaFacebook className="text-2xl cursor-pointer hover:text-gray-400" />
						<FaLinkedin className="text-2xl cursor-pointer hover:text-gray-400" />
					</div>
					<div className="flex items-center space-x-4 cursor-pointer">
						<p className="cursor-pointer">°F</p>
						<Switch checked={celsius} onChange={(event) => setCelsius(event.currentTarget.checked)} color="dark" size="lg" thumbIcon={celsius ? <p className="text-green-500 font-bold cursor-pointer">°C</p> : <p className="text-green-500 font-bold cursor-pointer">°F</p>} />
						<p className="cursor-pointer">°C</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center w-full text-white text-4xl pb-20">
				<h1 className="font-mono">{`Let's find some good weather`}</h1>
			</div>
		</header>
	);
}
export default Header;
