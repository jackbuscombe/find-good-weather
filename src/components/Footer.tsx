import Link from "next/link";
import { useRouter } from "next/router";
import { GiForwardSun } from "react-icons/gi";

function Footer() {
	const router = useRouter();

	return (
		<footer className="text-gray-700 p-4 rounded-t-lg shadow md:px-6 md:py-8 bg-blue-400">
			<div className="sm:flex sm:items-center sm:justify-between">
				<Link href={"/"}>
					<a className="flex items-center space-x-4 text-xl font-extrabold cursor-pointer">
						<GiForwardSun className="text-yellow-400 text-4xl" />
						<p className="text-gray-700">FIND GOOD WEATHER</p>
					</a>
				</Link>
				<ul className="flex flex-wrap items-center mb-6 text-sm sm:mb-0 ">
					<li>
						<Link href={"/about"}>
							<a className="cursor-pointer mr-4 hover:underline md:mr-6 ">About</a>
						</Link>
					</li>
					<li>
						<Link href={"/privacy"}>
							<a className="cursor-pointer mr-4 hover:underline md:mr-6">Privacy Policy</a>
						</Link>
					</li>
					<li>
						<Link href={"/licensing"}>
							<a className="cursor-pointer mr-4 hover:underline md:mr-6 ">Licensing</a>
						</Link>
					</li>
					<li>
						<Link href={"/contact"}>
							<a className="cursor-pointer hover:underline">Contact</a>
						</Link>
					</li>
				</ul>
			</div>
			<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<span className="block text-sm sm:text-center">
				© 2022{" "}
				<Link href={"/"}>
					<a className="hover:underline cursor-pointer">Find Good Weather</a>
				</Link>
				. All Rights Reserved.
			</span>
		</footer>
	);
}
export default Footer;
