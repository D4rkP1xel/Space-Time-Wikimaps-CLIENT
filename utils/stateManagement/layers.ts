import axiosNoAuth from "../axiosNoAuth"

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
async function getLayers(): Promise<Layer[]> {
    const response = await axiosNoAuth.get("/layers")
    //console.log(response)
    return response.data;
}

async function getLayer(id: number): Promise<Layer> {
    const response = await axiosNoAuth.get("/layers/" + id)
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

export { getLayers, getLayer, getLayerResults }
export type { LayerResult }