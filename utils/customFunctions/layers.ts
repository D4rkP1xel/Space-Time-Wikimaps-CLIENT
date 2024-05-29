import axiosNoAuth from "../axios/axiosNoAuth"
import axios from "../axios/axiosHandler"
import { User } from "../stateManagement/user"
import { AxiosError } from "axios"
interface Layer {
    id: number
    userDTO: User
    layerName: string
    description: string
    timestamp: string
    query: string
}

interface Layers {
    layers: Layer[]
    currentPage: number,
    totalItems: number,
    totalPages: number
}

interface APILayerResult {
    item: string | undefined
    coordinates: string | undefined
    itemLabel: string | undefined
    itemSchemaLabel: string | undefined
    url: string | undefined
    description: string | undefined
    image?: string
}
interface LayerResult {
    title?: string
    lat?: string
    lon?: string
    url?: string
    description?: string
    image?: string
    itemLabel?: string
}

interface GetPhotoResponse {
    results: [{ propertyValue: string }]
}
async function getLayers(search: string | null, page: string | null): Promise<Layers> {
    if (search == null) search = ""
    if (page == null || page == "") page = "1"
    const response = await axiosNoAuth.get("/layers?query=" + search + "&page=" + (Number(page) - 1) + "&size=5")
    console.log(response.data)
    return response.data;
}

async function getLayer(id: number): Promise<Layer> {
    const response = await axiosNoAuth.get("/layers/id/" + id)
    //console.log(response)
    return response.data;
}

async function getAllLayersByUserId(id: string): Promise<Layer[]> {
    const response = await axiosNoAuth.get("/users/" + id + "/layers")
    return response.data;
}

async function getLayerResults(layerId: number, startYear: number, endYear: number): Promise<LayerResult[]> {
    //const { data } = await axiosNoAuth.post("/sparql", { query })
    const { data } = await axiosNoAuth.get("/layers/" + layerId + "?lat1=-90&lon1=-180&lat2=90&lon2=180&start=" + startYear + "&end=" + endYear)
    console.log(data)
    return data.results.map((r: APILayerResult) => {
        let obj: LayerResult = {}

        if (r.coordinates) {
            const startIndex = r.coordinates.indexOf("(") + 1;
            const endIndex = r.coordinates.indexOf(")");
            const coordinates: string = r.coordinates.substring(startIndex, endIndex);

            const lon = coordinates.split(" ")[0]
            const lat = coordinates.split(" ")[1]
            obj["lat"] = lat;
            obj["lon"] = lon;
        }
        if (r.url) {
            obj["url"] = r.url;
        }
        if (r.itemSchemaLabel) {
            obj["title"] = r.itemSchemaLabel.split("@")[0]
        }
        if (r.description) {
            obj["description"] = r.description.split("@")[0]
        }
        if (r.itemLabel) {
            obj["itemLabel"] = r.itemLabel
        }
        if (r.image) {
            obj["image"] = r.image
        }
        return obj
    });
}

async function getLayerResultsByQuery(query: string): Promise<LayerResult[]> {
    const { data } = await axiosNoAuth.post("/sparql", { query })

    console.log(data)
    return data.results.map((r: APILayerResult) => {
        let obj: LayerResult = {}

        if (r.coordinates) {
            const startIndex = r.coordinates.indexOf("(") + 1;
            const endIndex = r.coordinates.indexOf(")");
            const coordinates: string = r.coordinates.substring(startIndex, endIndex);

            const lon = coordinates.split(" ")[0]
            const lat = coordinates.split(" ")[1]
            obj["lat"] = lat;
            obj["lon"] = lon;
        }
        if (r.url) {
            obj["url"] = r.url;
        }
        if (r.itemSchemaLabel) {
            obj["title"] = r.itemSchemaLabel.split("@")[0]
        }
        if (r.description) {
            obj["description"] = r.description.split("@")[0]
        }
        return obj
    });
}

async function createNewLayer(name: string, description: string, query: string): Promise<void> {
    if (name == null || name == "" || description == null || description == "" || query == null || query == "") throw ("One or more camps are empty.")
    try {
        await axios.post("/layers", { name, description, query })
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.message == "Invalid layer request") {
            throw ("Invalid SparQL query.")
        } else if (error instanceof AxiosError && error.response?.data?.message.startsWith("Layer name already exists")) {
            throw ("Layer Name already exists.")
        }
        throw (error)
    }

}

async function editLayer(id: string, name: string, description: string, query: string): Promise<void> {
    await axios.put("/layers/" + id, { name, description, query })
}

async function getPhoto(itemLabel: string): Promise<GetPhotoResponse> {
    const response = await axios.get("/data/property-values/" + itemLabel + "/P18")
    //console.log(response)
    return response.data
}

export { getLayers, getLayer, getLayerResults, createNewLayer, editLayer, getAllLayersByUserId, getLayerResultsByQuery, getPhoto }
export type { LayerResult, Layer }