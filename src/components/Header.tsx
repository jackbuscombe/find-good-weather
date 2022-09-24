import Link from "next/link";
import { GiForwardSun } from "react-icons/gi";
import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";

function Header() {
	return (
		<div className="w-full bg-blue-400 flex py-4 px-12 justify-between items-center">
			<Link href="/">
				<div className="flex items-center space-x-4 text-xl font-extrabold cursor-pointer">
					<GiForwardSun className="text-yellow-400 text-4xl" />
					<p className="text-white">FIND GOOD WEATHER</p>
				</div>
			</Link>
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
