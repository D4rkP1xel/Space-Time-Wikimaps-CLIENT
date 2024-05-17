import { LayerResult } from "../stateManagement/layers"

function GetMapLocationsOrganized(mapLocations: LayerResult[]): Map<string, LayerResult[]> {
    const map = new Map<string, LayerResult[]>()
    if (mapLocations != null && mapLocations.length > 0) {
        for (let i = 0; i < mapLocations.length; i++) {
            let key = mapLocations[i].lat + "-" + mapLocations[i].lon
            if (map.has(key)) {
                let curLocations = map.get(key)
                if (curLocations != null && curLocations.length > 0) {
                    curLocations.push(mapLocations[i])
                } else curLocations = [mapLocations[i]]

                map.set(key, curLocations)
            } else map.set(key, [mapLocations[i]])
        }
    }
    return map
}

export { GetMapLocationsOrganized }