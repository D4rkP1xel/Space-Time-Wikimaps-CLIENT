"use client"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl:
    "https://www.hooknortonvets.co.uk/wp-content/uploads/2016/11/map-pointer.png",
  iconSize: [40, 40], // size of the icon
})
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LayerResult } from "../../../utils/customFunctions/layers"
import ZoomHandler from "../main/ZoomHandler"
import { FaBookOpen } from "react-icons/fa"
import { GetMapLocationsOrganized } from "../../../utils/customFunctions/mapFunctions"
import MapMarkerResult from "../main/MapMarkerResult"
import { MdFullscreen } from "react-icons/md"

function HorizontalMap({
  mapLocations,
  center,
  setFullscreen,
}: {
  mapLocations: LayerResult[] | null | undefined
  center: [number, number] | null
  setFullscreen: any
}) {
  return (
    <>
      <div className="w-full pt-8">
        <MapContainer
          center={center ? center : [51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "300px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <div
            onClick={() => setFullscreen(true)}
            className="absolute bottom-0 left-0 z-[500] p-1 cursor-pointer">
            <MdFullscreen size={28} color="black" />
          </div>
          <ZoomHandler mapLocations={mapLocations} center={center} />
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

export default HorizontalMap
