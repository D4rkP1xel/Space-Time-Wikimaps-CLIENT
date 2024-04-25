"use client"
import { FaAngleLeft } from "react-icons/fa"

import Map from "@/components/main/Map"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MobileMap from "@/components/layer/MobileMap"
import { useQuery } from "react-query"
import {
  LayerResult,
  getLayer,
  getLayerResults,
} from "../../../../utils/stateManagement/layers"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import LayerResultDiv from "@/components/layer/LayerResult"

function Layer({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [pageWidth, setPageWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setPageWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const { data: layer, isLoading: isLoadingLayer } = useQuery(
    ["layer"],
    async () => {
      try {
        const data = await getLayer(Number.parseInt(params.id))
        return data
      } catch (error) {
        console.error(error)
        router.back()
      }
    }
  )

  const { data: results, isLoading: isLoadingResults } = useQuery(
    ["results"],
    async () => {
      try {
        if (layer == null) return
        const data = await getLayerResults(layer.query)
        return data
      } catch (error) {
        console.error(error)
        router.back()
      }
    },
    { enabled: layer != null }
  )

  if (isLoadingLayer) {
    return <PageCircleLoader />
  }
  return (
    <>
      <div className="flex">
        <div
          className="flex w-full pr-12 xl:pl-24 pl-12 pt-12 z-0"
          style={
            pageWidth > 1280
              ? { width: `calc(100% - 300px)` }
              : pageWidth > 1024
              ? { width: `calc(100% - 200px)` }
              : { width: "100%" }
          }>
          <div
            className={pageWidth > 1024 ? "w-full pr-48 z-10" : "w-full z-10"}>
            <div
              className="flex flex-row gap-4 cursor-pointer items-center select-none"
              onClick={() => router.back()}>
              <FaAngleLeft size={24} />
              <div className="text-md">Go Back</div>
            </div>
            <div className="text-3xl mt-8 font-medium">{layer?.layerName}</div>
            <div className="mt-4 text-lg">{layer?.description}</div>
            {pageWidth > 1024 ? null : <MobileMap />}

            <div className="text-xl mt-8 font-medium">Results:</div>
            {isLoadingResults ? (
              <PageCircleLoader />
            ) : results == undefined ||
              results == null ||
              results.length === 0 ? (
              <div>No Results</div>
            ) : (
              results.map((r: LayerResult, index) => {
                return <LayerResultDiv key={index} data={r} />
              })
            )}
            <div className="w-full h-20"></div>
          </div>
          {pageWidth > 1024 ? <Map /> : null}
        </div>
      </div>
    </>
  )
}

export default Layer
