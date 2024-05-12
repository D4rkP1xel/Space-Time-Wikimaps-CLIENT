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
function Map({ mapLocations }: { mapLocations: LayerResult[] }) {
  const [scrollY, setScrollY] = useState(0)

  function handleMapHeight() {
    let clampedScrollY = Math.min(Math.max(scrollY, 0), 80)
    return `calc(100vh - ` + (128 - clampedScrollY) + `px)`
  }

  function handleMapTop() {
    let clampedScrollY = Math.min(Math.max(scrollY, 0), 80)
    return 128 - clampedScrollY
  }

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrollY])

  return (
    <>
      <div
        className={`flex fixed xl:pr-24 pr-12 z-40 h-full right-0`}
        style={{ top: handleMapTop() }}
        onScroll={() => setScrollY(window.scrollY)}>
        <div className="ml-auto pb-8" style={{ height: handleMapHeight() }}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "300px", height: "calc(100% - 48px)" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Marker position={[51.5, -0.09]} icon={customIcon}>
              <Popup></Popup>
            </Marker> */}
          </MapContainer>
        </div>
      </div>
    </>
  )
}

export default Map
