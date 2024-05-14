import { FaMapMarkerAlt } from "react-icons/fa"
import { FaBookOpen } from "react-icons/fa"
import { LayerResult } from "../../../utils/stateManagement/layers"
import Image from "next/image"
import UnavailableImage from "./../../../public/icons/photo_unavailable.png"

function LayerResultDiv({
  result,
  setCenter,
}: {
  result: LayerResult
  setCenter: (center: [number, number]) => void
}) {
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-8 mt-4 ">
        <div className="flex h-80 w-80 aspect-square lg:mx-0 mx-auto">
          {result.image ? (
            <img className="w-full h-full object-cover" src={result.image} />
          ) : (
            <Image
              className="w-full h-full object-cover"
              src={UnavailableImage}
              alt={"Picture of " + result.title}
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="text-2xl font-semibold">
              {result.title ? result.title : "No Title Available"}
            </div>
            <div className="flex flex-row lg:ml-4 ml-auto">
              <div
                onClick={() => {
                  if (result.lat && result.lon)
                    setCenter([
                      Number.parseFloat(result.lat),
                      Number.parseFloat(result.lon),
                    ])
                }}
                className="flex flex-row items-center gap-2 select-none cursor-pointer">
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
            {result.description
              ? result.description
              : "No Description Available"}
          </div>
        </div>
      </div>
    </>
  )
}

export default LayerResultDiv
