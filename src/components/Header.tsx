import Link from "next/link";
import { useStore } from "../components/appStore";
import { TbSun } from "react-icons/tb";
import { Switch } from "@mantine/core";

function Header() {
  const celsius = useStore((state) => state.celsius);
  const setCelsius = useStore((state) => state.setCelsius);

  return (
    <header className="bg-[#445fc8] space-y-8 font-mono">
      <div className="w-full flex flex-col sm:flex-row py-4 px-4 sm:px-12 justify-between items-center">
        <Link href="/">
          <div className="w-full flex justify-center sm:justify-start items-center space-x-4 text-xl font-semibold cursor-pointer">
            <TbSun className="text-yellow-400 text-4xl min-h-6 min-w-6" />
            <p className="text-white">GoodWeather.ai</p>
          </div>
        </Link>

        {/* <p className="text-white font-semibold">{`${userCity ?? "Current Location"}: ${userWeather} ${userTemp?.toFixed(0)}°C`}</p> */}
        <div className="flex space-x-16 text-white">
          {/* <div className="flex items-center space-x-6">
						<p>Share social</p>
						<FaFacebook className="text-2xl cursor-pointer hover:text-gray-400" />
						<FaLinkedin className="text-2xl cursor-pointer hover:text-gray-400" />
					</div> */}
          <div className="flex items-center space-x-4 mt-6 sm:mt-0 cursor-pointer">
            <p className="cursor-pointer">°F</p>
            <Switch
              checked={celsius}
              onChange={(event) => setCelsius(event.currentTarget.checked)}
              color="dark"
              size="lg"
              thumbIcon={
                celsius ? (
                  <p className="text-green-500 font-bold cursor-pointer">°C</p>
                ) : (
                  <p className="text-green-500 font-bold cursor-pointer">°F</p>
                )
              }
            />
            <p className="cursor-pointer">°C</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full text-white text-4xl pb-20 px-4 text-center">
        <h1 className="font-mono">{`Let's find some good weather`}</h1>
      </div>
    </header>
  );
}
export default Header;
