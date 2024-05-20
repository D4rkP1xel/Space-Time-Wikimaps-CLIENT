import { FaMapMarkerAlt } from "react-icons/fa"
import { FaBookOpen } from "react-icons/fa"
import { LayerResult, getPhoto } from "../../../utils/stateManagement/layers"
import Image from "next/image"
import UnavailableImage from "./../../../public/icons/photo_unavailable.png"
import { useEffect } from "react"
import { useQuery } from "react-query"

function LayerResultDiv({
  result,
  setCenter,
}: {
  result: LayerResult
  setCenter: (center: [number, number]) => void
}) {
  // const { data: photo, isLoading: isLoadingPhoto } = useQuery(
  //   ["photo", result.itemLabel],
  //   async () => {
  //     try {
  //       if (!result.itemLabel) return
  //       const data = await getPhoto(result.itemLabel)
  //       if (data?.results[0]?.propertyValue)
  //         return data.results[0].propertyValue
  //       else return null
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   },
  //   { enabled: result.itemLabel != null }
  // )
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-8 mt-4 ">
        <div className="flex h-80 w-80 aspect-square lg:mx-0 mx-auto flex-shrink-0">
          {result?.image != null ? (
            <img className="w-full h-full object-cover" src={result.image} />
          ) : (
            // : photo && !isLoadingPhoto ? (
            //   <img className="w-full h-full object-cover" src={photo} />
            // )
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
              {result.url ? (
                <div
                  onClick={() => window.open(result.url, "_blank")}
                  className="flex flex-row lg:ml-6 ml-4 items-center gap-2 select-none cursor-pointer">
                  <FaBookOpen size={16} />
                  <div className="text-md font-medium">Read about</div>
                </div>
              ) : null}
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
