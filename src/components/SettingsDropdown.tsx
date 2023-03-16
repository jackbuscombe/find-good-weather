import { Checkbox, Radio, Select } from "@mantine/core";
import SearchFormField from "./SearchFormField";
import { RiRouteLine } from "react-icons/ri";
import { useStore } from "./appStore";

function SettingsDropdown() {
  const transportModes = useStore((state) => state.transportModes);
  const setTransportModes = useStore((state) => state.setTransportModes);
  const viewType = useStore((state) => state.viewType);
  const setViewType = useStore((state) => state.setViewType);
  const maxDistanceKms = useStore((state) => state.maxDistanceKms);
  const setMaxDistanceKms = useStore((state) => state.setMaxDistanceKms);

  const toggleAllTransportModes = () => {
    if (transportModes.length === 3) {
      setTransportModes([]);
    } else {
      setTransportModes(["airplane", "train", "car"]);
    }
  };

  const handleTransportModeCheck = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let updatedList = [...transportModes];
    if (event.target.checked) {
      updatedList = [...transportModes, event.target.value];
    } else {
      updatedList.splice(transportModes.indexOf(event.target.value), 1);
    }
    setTransportModes(updatedList);
  };

  return (
    <div className="absolute grid grid-cols-2 lg:grid-cols-4 shadow border rounded p-4 sm:p-12 bg-white left-1/2 z-10 mt-10 w-60 md:w-screen max-w-sm -translate-x-1/2 lg:-translate-x-3/4 transform lg:max-w-3xl text-sm sm:text-lg">
      {/* <div className="w-full absolute grid grid-cols-2 md:grid-cols-4 bg-white border shadow rounded z-50 p-12 mt-2"> */}
      <div className="col-span-2 md:col-span-1">
        <h2 className="text-lg sm:text-2xl font-bold font-mono">Settings</h2>
      </div>
      <div>
        <p className="text-lg font-semibold mb-4">View type</p>
        <div className="flex flex-col space-y-2">
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={() => setViewType("vertical")}
          >
            <input
              className="w-6 h-6 cursor-pointer"
              type="radio"
              checked={viewType === "vertical"}
              onChange={() => setViewType("vertical")}
              value="vertical"
            />
            <label className="cursor-pointer">Standard</label>
          </div>
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={() => setViewType("map")}
          >
            <input
              className="w-6 h-6 cursor-pointer"
              type="radio"
              checked={viewType === "map"}
              onChange={() => setViewType("map")}
              value="map"
            />
            <label className="cursor-pointer">Map</label>
          </div>
        </div>
      </div>
      {/* <div>
        <p className="text-lg font-semibold mb-4">Show me transport</p>
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex space-x-2 items-center cursor-pointer">
            <input
              className="w-6 h-6 cursor-pointer"
              type="checkbox"
              checked={transportModes.includes("airplane")}
              onChange={(e) => handleTransportModeCheck(e)}
              value="airplane"
            />
            <label className="cursor-pointer">Airplane</label>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            <input
              className="w-6 h-6 cursor-pointer"
              type="checkbox"
              checked={transportModes.includes("train")}
              onChange={(e) => handleTransportModeCheck(e)}
              value="train"
            />
            <label className="cursor-pointer">Train</label>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            <input
              className="w-6 h-6 cursor-pointer"
              type="checkbox"
              checked={transportModes.includes("car")}
              onChange={(e) => handleTransportModeCheck(e)}
              value="car"
            />
            <label className="cursor-pointer">Car</label>
          </div>
        </div>
        <button
          onClick={toggleAllTransportModes}
          className="w-1/2 p-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition transform ease-in-out"
        >
          {transportModes.length === 3 ? "Deselect All" : "Select All"}
        </button>
      </div> */}
      <div className="col-span-2 md:col-span-1">
        <p className="text-lg font-semibold mb-4">Max distance within:</p>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={0}
            value={maxDistanceKms}
            onChange={(e) => setMaxDistanceKms(parseInt(e.target.value))}
            className="border p-2 rounded w-2/3"
          />
          <p>{"km's"}</p>
        </div>
        {/* <SearchFormField
          title="Travel time"
          icon={
            <RiRouteLine className="text-4xl text-yellow-500 md:inline-flex cursor-pointer md:mx-2" />
          }
        >
          <Select
            placeholder="Pick one"
            data={[
              { value: "1 hour", label: "1 hour" },
              { value: "2", label: "2 hours" },
              { value: "4", label: "4 hours" },
              { value: "6", label: "6 hours" },
              { value: "12", label: "12 hours" },
              { value: "24", label: "1 day" },
              { value: "48", label: "2 days" },
              { value: "72", label: "3 days" },
              { value: "96", label: "4 days" },
            ]}
            variant="unstyled"
            transition="pop-top-left"
            transitionDuration={80}
            transitionTimingFunction="ease"
          />
        </SearchFormField> */}
      </div>
    </div>
  );
}
export default SettingsDropdown;
