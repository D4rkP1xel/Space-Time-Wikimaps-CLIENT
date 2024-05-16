import React, { useEffect } from "react"
import { useMap } from "react-leaflet"
import { LayerResult } from "../../../utils/stateManagement/layers"

function ZoomHandler({
  mapLocations,
}: {
  mapLocations: LayerResult[] | null | undefined
}) {
  const map = useMap()

  useEffect(() => {
    if (map != null && mapLocations != null && mapLocations.length > 0) {
      let latHighestValue: number = -180
      let latLowestValue: number = 180
      let lonHighestValue: number = -180
      let lonLowestValue: number = 180

      for (let i = 0; i < mapLocations.length; i++) {
        if (
          mapLocations[i].lat == null ||
          mapLocations[i].lon == null ||
          mapLocations[i].lat == undefined ||
          mapLocations[i].lon == undefined
        ) {
          continue
        }
        if (Number.parseFloat(mapLocations[i].lat!) > latHighestValue)
          latHighestValue = Number.parseFloat(mapLocations[i].lat!)
        if (Number.parseFloat(mapLocations[i].lat!) < latLowestValue)
          latLowestValue = Number.parseFloat(mapLocations[i].lat!)
        if (Number.parseFloat(mapLocations[i].lon!) > lonHighestValue)
          lonHighestValue = Number.parseFloat(mapLocations[i].lon!)
        if (Number.parseFloat(mapLocations[i].lon!) < lonLowestValue)
          lonLowestValue = Number.parseFloat(mapLocations[i].lon!)
      }
      map.fitBounds([
        [latHighestValue, lonLowestValue],
        [latLowestValue, lonHighestValue],
      ])
    }
  }, [map, mapLocations])
  return <div></div>
}

export default ZoomHandler
