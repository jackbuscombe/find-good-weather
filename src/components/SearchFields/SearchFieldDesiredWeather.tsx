import { Menu, Transition, Listbox } from "@headlessui/react";
import { BiChevronDown, BiPlus, BiCheck } from "react-icons/bi";
import { Fragment } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { useStore } from "../appStore";

type Props = {
	options: string[];
};

function SearchFieldDesiredWeather({ options }: Props) {
	const desiredWeather = useStore((state) => state.desiredWeather);
	const setDesiredWeather = useStore((state) => state.setDesiredWeather);

	return (
		<Listbox value={desiredWeather} onChange={setDesiredWeather}>
			<div className="relative mt-1">
				<Listbox.Button className="relative w-full cursor-pointer bg-transparent text-left text-lg font-bold">
					<span className="block truncate">{capitalizeFirstLetter(desiredWeather)}</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<BiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</span>
				</Listbox.Button>
				<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
					<Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{options &&
							options.map((option) => (
								<Listbox.Option key={option} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`} value={option}>
									{({ selected }) => (
										<>
											<span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{capitalizeFirstLetter(option)}</span>
											{selected ? (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
													<BiCheck className="h-5 w-5" aria-hidden="true" />
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
}
export default SearchFieldDesiredWeather;
