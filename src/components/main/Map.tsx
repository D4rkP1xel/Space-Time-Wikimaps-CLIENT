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
function ReactControlExample() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.5, -0.09]} icon={customIcon}>
        <Popup></Popup>
      </Marker>
    </MapContainer>
  )
}

export default ReactControlExample
