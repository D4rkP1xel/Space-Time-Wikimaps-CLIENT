import React from "react"
import { LayerResult } from "../../../utils/customFunctions/layers"
import Image from "next/image"
import UnavailableImage from "./../../../public/icons/photo_unavailable.png"
import { FaBookOpen } from "react-icons/fa"

function MapMarkerResult({ mapLocation }: { mapLocation: LayerResult }) {
  return (
    <div className="flex flex-row gap-4 items-center">
      {mapLocation.image ? (
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={mapLocation.image}
        />
      ) : (
        <Image
          className="w-12 h-12 rounded-full object-cover"
          src={UnavailableImage}
          alt={"Picture of " + mapLocation.title}
        />
      )}
      <div className="flex flex-col w-40">
        <div className="font-bold mb-2">{mapLocation.title}</div>
        {mapLocation.url ? (
          <div
            onClick={() => window.open(mapLocation.url, "_blank")}
            className="flex flex-row items-center gap-2 select-none cursor-pointer">
            <FaBookOpen size={16} />
            <div className="text-md font-semibold">Read about</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default MapMarkerResult
