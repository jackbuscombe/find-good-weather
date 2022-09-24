import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { useState, useEffect, useRef } from "react";
import { FaBed, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { Select } from "@mantine/core";
import ResultsTable from "../components/ResultsTable";

const Home: NextPage = () => {
	const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
	const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [noOfGuests, setNoOfGuests] = useState(1);
	const datepickerWrapperRef = useRef(null);
	useOutsideAlerter(datepickerWrapperRef);

	const handleSelect = (ranges: any) => {
		setStartDate(ranges.selection.startDate);
		setEndDate(ranges.selection.endDate);
	};

	const selectionRange = {
		startDate: startDate,
		endDate: endDate,
		key: "selection",
	};

	const resetInput = () => {
		setSearchInput("");
	};

	function useOutsideAlerter(ref: any) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsDatepickerOpen(false);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	return (
		<>
			<Head>
				<title>Find Good Weather</title>
				<meta name="description" content="Find good weather" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col items-center px-1/4 py-12 bg-cover h-full" style={{ backgroundImage: "url('/booking-bg.jpg')", boxShadow: "0px 4px 4px 0px #00000040,inset 0 0 0 1000px rgba(0,0,0,0.3)" }}>
				<h1 className="text-3xl mb-8 font-bold text-white">{`Let's find some good weather`}</h1>
				{/* Form */}
				<div className="w-auto flex items-center md:border-2 rounded-l-full md:shadow-sm bg-white">
					<div className="flex items-center">
						<FaBed className="text-4xl md:inline-flex bg-red-400 text-white p-2 rounded-full cursor-pointer md:mx-2" />
						<input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="outline-none border-none pl-5 bg-transparent flex-grow text-sm text-gray-600 placeholder-gray-400" type="text" placeholder={searchInput || "Start your search"} />
					</div>

					<div ref={datepickerWrapperRef}>
						<div className="flex items-center" onClick={() => setIsDatepickerOpen(true)}>
							<FaRegCalendarAlt className="text-4xl md:inline-flex bg-red-400 text-white p-2 rounded-full cursor-pointer md:mx-2" />
							<input placeholder={`${startDate} - ${endDate}`} className="outline-none border-none pl-5 bg-transparent flex-grow text-sm text-gray-600 placeholder-gray-400 cursor-pointer" type="text" />
						</div>
						{isDatepickerOpen && (
							<div className="absolute mx-auto mt-2">
								<DateRangePicker ranges={[selectionRange]} minDate={new Date()} rangeColors={["#FD5B61"]} onChange={handleSelect} />
							</div>
						)}
					</div>

					<div className="flex items-center">
						<FaUser className="text-4xl md:inline-flex bg-red-400 text-white p-2 rounded-full cursor-pointer md:mx-2" />
						<Select
							className="outline-none border-none pl-5 bg-transparent flex-grow text-sm text-gray-600 placeholder-gray-400"
							placeholder="How many people?"
							data={[
								{ value: "1", label: "1 Adult" },
								{ value: "2", label: "2 Adults" },
								{ value: "3", label: "3 Adults" },
								{ value: "4", label: "4 Adults" },
								{ value: "5", label: "5 Adults" },
								{ value: "6", label: "6 Adults" },
							]}
							transition="pop-top-left"
							transitionDuration={80}
							transitionTimingFunction="ease"
							variant="unstyled"
						/>
					</div>

					<button className="bg-blue-500 text-white p-4 h-full font-bold hover:bg-blue-600">Search</button>
				</div>

				<div className="w-1/2 mt-8 bg-white">
					<ResultsTable />
				</div>
			</main>
		</>
	);
};

export default Home;
