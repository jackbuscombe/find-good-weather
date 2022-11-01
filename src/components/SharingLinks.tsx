import { TbBrandFacebook, TbBrandInstagram, TbBrandTwitter } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";

function SharingLinks() {
	return (
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
	);
}
export default SharingLinks;
