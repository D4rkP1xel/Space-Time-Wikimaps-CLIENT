"use client"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"

const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl:
    "https://www.hooknortonvets.co.uk/wp-content/uploads/2016/11/map-pointer.png",
  iconSize: [40, 40], // size of the icon
})
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LayerResult } from "../../../utils/stateManagement/layers"
import ZoomHandler from "../main/ZoomHandler"

function MobileMap({
  mapLocations,
  center,
}: {
  mapLocations: LayerResult[] | null | undefined
  center: [number, number]
}) {
  return (
    <>
      <div className="w-full pt-8">
        <MapContainer
          key={center[0] + "-" + center[1]}
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "300px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomHandler mapLocations={mapLocations} />
          {/* <Marker position={[51.5, -0.09]} icon={customIcon}>
            <Popup></Popup>
          </Marker> */}
          {mapLocations != null && mapLocations.length > 0
            ? mapLocations.map((ml: LayerResult, index: number) => {
                if (ml.lat == null || ml.lon == null) return
                return (
                  <Marker
                    key={index}
                    position={[
                      Number.parseFloat(ml.lat),
                      Number.parseFloat(ml.lon),
                    ]}
                    icon={customIcon}>
                    <Popup></Popup>
                  </Marker>
                )
              })
            : null}
        </MapContainer>
      </div>
    </>
  )
}

export default MobileMap
