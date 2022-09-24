import Link from "next/link";
import { GiForwardSun } from "react-icons/gi";
import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useStore } from "../components/appStore";
import { trpc } from "../utils/trpc";

function Header() {
	const [currentLatitude, setCurrentLatitude] = useState<number>(0);
	const [currentLongitude, setCurrentLongitude] = useState<number>(0);
	const [userCityName, setUserCityName] = useState<string>("");
	const userLat = useStore((state) => state.userLat);
	const userLong = useStore((state) => state.userLong);
	const userCity = useStore((state) => state.userCity);
	const userWeather = useStore((state) => state.userWeather);
	const userTemp = useStore((state) => state.userTemp);
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
		<div className="w-full bg-blue-400 flex py-4 px-12 justify-between items-center">
			<Link href="/">
				<div className="flex items-center space-x-4 text-xl font-extrabold cursor-pointer">
					<GiForwardSun className="text-yellow-400 text-4xl" />
					<p className="text-white">FIND GOOD WEATHER</p>
				</div>
			</Link>

			<p className="text-white font-semibold">{`${userCity ?? "Current Location"}: ${userWeather} ${userTemp?.toFixed(0)}°C`}</p>

			<div className="flex space-x-4 text-white items-center">
				<ActionIcon variant="filled" size="lg" color={"blue"}>
					<TbBrandFacebook className="cursor-pointer hover:font-bold" />
				</ActionIcon>
				<ActionIcon variant="filled" size="lg" color={"blue"}>
					<TbBrandInstagram className="cursor-pointer hover:font-bold" />
				</ActionIcon>
				<ActionIcon variant="filled" size="lg" color={"blue"}>
					<TbBrandTwitter className="cursor-pointer hover:font-bold" />
				</ActionIcon>
			</div>
		</div>
	);
}
export default Header;
