"use client"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import {
  LayerResult,
  createNewLayer,
  editLayer,
  getLayer,
  getLayerResults,
  getLayerResultsByQuery,
} from "../../../utils/stateManagement/layers"
import { useRouter } from "next/navigation"
import PageCircleLoader from "../loaders/PageCircleLoader"
import { useUserState } from "../../../utils/stateManagement/user"
import toast from "react-hot-toast"
import MobileMap from "../maps/MobileMap"
import MapFullScreen from "../maps/MapFullScreen"
function CreateEditLayer({ layerId }: { layerId: string | null }) {
  // When layerId is null, user is creating a layer
  // otherwise it's editing an existing layer
  //const [center, setCenter] = useState<[number, number]>([51.505, -0.09])
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [query, setQuery] = useState("")
  const [lastQuery, setLastQuery] = useState("")
  const [resultString, setResultString] = useState<string>("")
  const [results, setResults] = useState<LayerResult[]>()
  const [isFullscreen, setFullscreen] = useState(false)
  const useUser = useUserState()
  const {
    data: layer,
    isLoading: isLoadingLayer,
    refetch: refetchLayer,
  } = useQuery(
    ["editlayer"],
    async () => {
      try {
        if (layerId == null) return
        const data = await getLayer(Number.parseInt(layerId))
        if (data.userDTO.id != useUser.user?.id) {
          router.back()
          return
        }
        setName(data.layerName)
        setDescription(data.description)
        setQuery(data.query)
        setLastQuery(data.query)

        return data
      } catch (error) {
        console.error(error)
        router.back()
      }
    },
    {
      enabled: layerId != null && layerId != "" && useUser.user != null,
      refetchOnWindowFocus: true,
      refetchOnMount: "always",
    }
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsResp = await getLayerResultsByQuery(lastQuery)
        console.log(resultsResp)
        setResultString(JSON.stringify(resultsResp))
        // if (resultsResp[0].lat != null && resultsResp[0].lon != null) {
        //   setCenter([
        //     Number.parseFloat(resultsResp[0].lat),
        //     Number.parseFloat(resultsResp[0].lon),
        //   ])
        // }
        setResults(resultsResp)
      } catch (error) {
        console.error(error)
        setResultString("")
        setResults([])
        toast.error("Error while executing SparQL query.")
      }
    }

    if (lastQuery != null && lastQuery !== "") {
      fetchData()
    }
  }, [lastQuery])

  async function createLayer(
    nameParam: string,
    descriptionParam: string,
    queryParam: string
  ) {
    try {
      await createNewLayer(nameParam, descriptionParam, queryParam)
      toast.success("Layer created successfully!")
      router.push("/")
    } catch (error) {
      console.error(error)
      if (
        typeof error === "string" &&
        (error == "One or more camps are empty." ||
          error == "Invalid SparQL query." ||
          error == "Layer Name already exists.")
      ) {
        toast.error(error)
      } else toast.error("Unknown Error.")
    }
  }

  async function editCurrentLayer(
    nameParam: string,
    descriptionParam: string,
    queryParam: string
  ) {
    try {
      if (layerId == null) {
        console.error("ERROR: layerId is null")
        return
      }
      await editLayer(layerId, nameParam, descriptionParam, queryParam)
      console.log("layer edited")
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoadingLayer) return <PageCircleLoader />
  else
    return (
      <>
        <div className="flex flex-col w-full xl:px-24 px-12 pt-12">
          <div className="font-bold text-2xl mb-12">
            {layerId == null ? "New layer" : "Edit Layer"}
          </div>
          {/* Part of the Name */}
          <div className="flex mb-12">
            <div className="mr-2 text-lg font-bold">Name:</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 px-2 py-1 rounded flex-grow"
              placeholder="Enter a Layer Name"
            />
          </div>
          {/* Part of the Description */}
          <div className="flex mb-2">
            <div className="mr-2 text-lg font-bold">Description:</div>
          </div>
          <div className=" flex justify-center items-center mb-12">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-400 px-2 py-1 rounded flex-grow w-full h-36"
              placeholder="Enter a Layer Description"
            />
          </div>
          {/* Part of the SparSQL and Map */}

          <div className="text-lg font-bold mb-2">SparQL Query:</div>
          <div className=" flex justify-center items-center mb-6">
            <MobileMap
              center={[51.505, -0.09]}
              mapLocations={results}
              setFullscreen={setFullscreen}
            />
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-400 px-2 py-1 mb-2 rounded background-gray-400 h-36 w-full"
            placeholder="Enter a SparQL query"
          />

          {/* Test Query button */}
          <div className="justify-center flex mb-12">
            <DarkBlueButton
              onClick={() => {
                if (query == "") toast.error("Fill in the SparQL query field.")
                setLastQuery(query)
              }}
              logoComponent={null}
              buttonText="Test Query"
            />
          </div>

          {/* Part of Query Result */}
          <div className="flex mb-2">
            <div className="mr-2 text-lg font-bold">Query Result:</div>
          </div>
          <div className=" flex justify-center items-center mb-12 ">
            <textarea
              value={resultString}
              disabled
              className="border border-gray-400 px-2 py-1 rounded flex-grow w-full h-36"
            />
          </div>

          {/* Create Layer button */}
          <div className="flex justify-center items-center mb-12">
            {layerId == null ? (
              <DarkBlueButton
                onClick={() => createLayer(name, description, query)}
                logoComponent={null}
                buttonText="Create Layer"
              />
            ) : (
              <DarkBlueButton
                onClick={() => editCurrentLayer(name, description, query)}
                logoComponent={null}
                buttonText="Save Changes"
              />
            )}
          </div>
        </div>
        {isFullscreen ? (
          <MapFullScreen mapLocations={results} setFullscreen={setFullscreen} />
        ) : null}
      </>
    )
}

export default CreateEditLayer
