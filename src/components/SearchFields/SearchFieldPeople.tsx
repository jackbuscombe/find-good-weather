import { Menu, Transition, Listbox } from "@headlessui/react";
import { BiChevronDown, BiPlus, BiCheck } from "react-icons/bi";
import { Fragment } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { useStore } from "../appStore";

type Props = {
	options: {
		value: number;
		label: string;
	}[];
};

function SearchFieldPeople({ options }: Props) {
	const peopleCount = useStore((state) => state.peopleCount);
	const setPeopleCount = useStore((state) => state.setPeopleCount);

	return (
		<Listbox value={peopleCount} onChange={setPeopleCount}>
			<div className="relative mt-1 w-full">
				<Listbox.Button className="relative flex justify-between items-center cursor-pointer bg-transparent text-left text-lg font-bold">
					<span className="block truncate mr-3 font-mono">{`${peopleCount} ${peopleCount === 1 ? "Adults" : "Adults"}`}</span>
					<BiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</Listbox.Button>
				<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
					<Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{options &&
							options.map(({ value, label }) => (
								<Listbox.Option key={value} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`} value={value}>
									{({ selected }) => (
										<>
											<span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{label}</span>
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
export default SearchFieldPeople;
