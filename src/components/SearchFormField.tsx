import { FiChevronDown } from "react-icons/fi";

type Props = {
  icon: any;
  title: string;
  children: any;
};

function SearchFormField({ icon, title, children }: Props) {
  return (
    <div className="relative z-10 flex items-center rounded-lg bg-gray-100 p-2 cursor-pointer hover:bg-gray-200 transition transform ease-in-out text-xs sm:text-lg">
      {icon}
      <div className="flex flex-col ml-2">
        <p className="text-gray-500">{title}</p>
        {children}
      </div>
    </div>
  );
}
export default SearchFormField;
