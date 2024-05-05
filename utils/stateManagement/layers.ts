import axiosNoAuth from "../axiosNoAuth"
import axios from "../axiosHandler"
interface Layer {
    id: number
    username: string
    layerName: string
    description: string
    timestamp: string
    query: string
}

interface APILayerResult {
    item: string | undefined
    where: string | undefined
    itemLabel: string | undefined
    url: string | undefined
}
interface LayerResult {
    lat?: string
    lon?: string
    url?: string
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

async function getLayerResults(query: string): Promise<LayerResult[]> {
    const { data } = await axiosNoAuth.post("/sparql", { query })
    console.log(data)
    return data.results.map((r: APILayerResult) => {
        let obj: LayerResult = {}
        if (r.where) {
            const startIndex = r.where.indexOf("(") + 1;
            const endIndex = r.where.indexOf(")");
            const coordinates: string = r.where.substring(startIndex, endIndex);
            const lat = coordinates.split(" ")[0]
            const lon = coordinates.split(" ")[1]
            obj["lat"] = lat;
            obj["lon"] = lon;
        }
        return obj
    });
}

async function createNewLayer(name: string, description: string, query: string): Promise<void> {
    await axios.post("/layers/create", { name, description, query })
}

async function editLayer(id: string, name: string, description: string, query: string): Promise<void> {
    await axios.put("/layers/" + id, { name, description, query })
}

export { getLayers, getLayer, getLayerResults, createNewLayer, editLayer }
export type { LayerResult }