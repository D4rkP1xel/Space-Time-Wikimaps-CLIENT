import React from "react"
import { LayerResult } from "../../../utils/customFunctions/layers"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { MdFullscreenExit } from "react-icons/md"
import ZoomHandler from "../main/ZoomHandler"
import { GetMapLocationsOrganized } from "../../../utils/customFunctions/mapFunctions"
import { Icon } from "leaflet"
import MapMarkerResult from "../main/MapMarkerResult"
import { FiX } from "react-icons/fi"
const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl:
    "https://www.hooknortonvets.co.uk/wp-content/uploads/2016/11/map-pointer.png",
  iconSize: [40, 40], // size of the icon
})
function MapFullScreen({
  mapLocations,
  setFullscreen,
}: {
  mapLocations: LayerResult[] | null | undefined
  setFullscreen: any
}) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-[1100] p-8">
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex " />
        <MapContainer
          // key={center[0] + "-" + center[1]}
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", zIndex: 1100 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <div
            onClick={() => setFullscreen(false)}
            className="absolute bottom-0 left-0 z-[1200] p-4 cursor-pointer">
            <MdFullscreenExit size={40} color="black" />
          </div>
          <div
            onClick={() => setFullscreen(false)}
            className="absolute top-0 right-0 z-[1200] p-4 cursor-pointer">
            <FiX size={40} color="black" />
          </div>
          <ZoomHandler mapLocations={mapLocations} center={null} />
          {mapLocations != null && mapLocations.length > 0
            ? Array.from(GetMapLocationsOrganized(mapLocations).values()).map(
                (mls: LayerResult[], index: number) => {
                  if (mls.length > 0) {
                    return (
                      <Marker
                        key={index}
                        position={[
                          Number.parseFloat(mls[0].lat!),
                          Number.parseFloat(mls[0].lon!),
                        ]}
                        icon={customIcon}>
                        <Popup closeButton={false}>
                          <div className="flex flex-col gap-3">
                            {mls.map((ml: LayerResult, mlIndex: number) => {
                              return (
                                <MapMarkerResult
                                  key={mlIndex}
                                  mapLocation={ml}
                                />
                              )
                            })}
                          </div>
                        </Popup>
                      </Marker>
                    )
                  }
                }
              )
            : null}
        </MapContainer>
      </div>
    </>
  )
}

export default MapFullScreen
