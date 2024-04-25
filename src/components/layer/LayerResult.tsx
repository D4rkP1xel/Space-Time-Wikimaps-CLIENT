import { FaMapMarkerAlt } from "react-icons/fa"
import { FaBookOpen } from "react-icons/fa"
import { LayerResult } from "../../../utils/stateManagement/layers"
function LayerResultDiv({ data }: { data: LayerResult }) {
  return (
    <div className="flex lg:flex-row flex-col gap-8 mt-4 ">
      <div className="flex h-80 w-80 aspect-square lg:mx-0 mx-auto">
        <img
          className="w-full h-full object-cover"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/640px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="text-2xl font-semibold">Cristiano Ronaldo</div>
          <div className="flex flex-row lg:ml-4 ml-auto">
            <div className="flex flex-row items-center gap-2 select-none cursor-pointer">
              <FaMapMarkerAlt size={16} />
              <div className="text-md font-medium">View On Map</div>
            </div>
            <div className="flex flex-row lg:ml-6 ml-4 items-center gap-2 select-none cursor-pointer">
              <FaBookOpen size={16} />
              <div className="text-md font-medium">Read about</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-gray-600 font-normal text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </div>
      </div>
    </div>
  )
}

export default LayerResultDiv
