"use client"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import MobileMap from "@/components/layer/MobileMap"
import { useState } from "react"
import { useQuery } from "react-query"
import axiosNoAuth from "../../../utils/axiosNoAuth"

function CreateLayers() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")

  async function GetSparQlResult(queryParam: string) {
    try {
      const response = await axiosNoAuth.post("/sparql", {
        query:
          'SELECT DISTINCT ?item ?itemLabel ?when ?where ?url WHERE { ?url schema:about ?item . ?url schema:inLanguage "pt" . FILTER (STRSTARTS(str(?url), "https://pt.wikipedia.org/")). SERVICE wikibase:box { ?item wdt:P625 ?where . bd:serviceParam wikibase:cornerSouthWest "Point(-9.52 36.95)"^^geo:wktLiteral. bd:serviceParam wikibase:cornerNorthEast "Point(-6.18 42.16)"^^geo:wktLiteral. } OPTIONAL { ?item wdt:P585 ?when . } SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]" . } } ORDER BY ASC(?when) LIMIT 1000',
      })
      setResult(JSON.stringify(response.data))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col w-full xl:px-24 px-12 pt-12">
      <div className="font-bold text-2xl mb-12">New layer</div>
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
        <DarkBlueButton
          onClick={() => null}
          logoComponent={null}
          buttonText="Create Layer"
        />
      </div>
    </div>
  )
}

export default CreateLayers
