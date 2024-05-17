import axiosNoAuth from "../axiosNoAuth"
import axios from "../axiosHandler"
import { User } from "./user"
interface Layer {
    id: number
    userDTO: User
    layerName: string
    description: string
    timestamp: string
    query: string
}

interface APILayerResult {
    item: string | undefined
    coordinates: string | undefined
    itemLabel: string | undefined
    itemSchemaLabel: string | undefined
    url: string | undefined
    description: string | undefined
}
interface LayerResult {
    title?: string
    lat?: string
    lon?: string
    url?: string
    description?: string
    image?: string
}
async function getLayers(search: string | null): Promise<Layer[]> {
    if (search == null) search = ""
    const response = await axiosNoAuth.get("/layers/search?query=" + search)
    console.log(search)
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

async function getLayerResults(query: string): Promise<LayerResult[]> {
    const { data } = await axiosNoAuth.post("/sparql", { query })
    //console.log(data)
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
    await axios.post("/layers", { name, description, query })
}

async function editLayer(id: string, name: string, description: string, query: string): Promise<void> {
    await axios.put("/layers/" + id, { name, description, query })
}

export { getLayers, getLayer, getLayerResults, createNewLayer, editLayer, getAllLayersByUserId }
export type { LayerResult, Layer }