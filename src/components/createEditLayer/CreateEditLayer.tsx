"use client"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import MobileMap from "@/components/layer/MobileMap"
import { useState } from "react"
import { useQuery } from "react-query"
import axiosNoAuth from "../../../utils/axiosNoAuth"
import {
  createNewLayer,
  editLayer,
  getLayer,
} from "../../../utils/stateManagement/layers"
import { useRouter } from "next/navigation"
import PageLoader from "next/dist/client/page-loader"
import PageCircleLoader from "../loaders/PageCircleLoader"

function CreateEditLayer({ layerId }: { layerId: string | null }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")

  async function GetSparQlResult(queryParam: string) {
    try {
      const response = await axiosNoAuth.post("/sparql", {
        query: query,
      })
      setResult(JSON.stringify(response.data))
    } catch (error) {
      console.error(error)
    }
  }

  const { data: layer, isLoading: isLoadingLayer } = useQuery(
    ["layer"],
    async () => {
      try {
        if (layerId == null) return
        const data = await getLayer(Number.parseInt(layerId))
        //console.log(data)
        setName(data.layerName)
        setDescription(data.description)
        setQuery(data.query)
        return data
      } catch (error) {
        console.error(error)
        router.back()
      }
    },
    { enabled: layerId != null }
  )

  async function createLayer(
    nameParam: string,
    descriptionParam: string,
    queryParam: string
  ) {
    try {
      await createNewLayer(nameParam, descriptionParam, queryParam)
    } catch (error) {
      console.error(error)
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
          <MobileMap />
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
            onClick={() => GetSparQlResult(query)}
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
            value={result}
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
    )
}

export default CreateEditLayer