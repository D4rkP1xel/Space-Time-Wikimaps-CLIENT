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
import { FaRegEdit } from "react-icons/fa"
import EditButton from "@/components/buttons/EditButton"
import { useUserState } from "../../../../utils/stateManagement/user"

function Layer({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [pageWidth, setPageWidth] = useState(window.innerWidth)
  const [center, setCenter] = useState<[number, number] | null>(null)
  const useUser = useUserState()
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
    ["layer", params.id],
    async () => {
      try {
        const data = await getLayer(Number.parseInt(params.id))
        console.log(data)
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
            <div className="mt-8 flex gap-8">
              <div className="text-3xl font-medium">{layer?.layerName}</div>
              {useUser.isUserAuth() &&
              (useUser.user?.role == "ADMIN" ||
                useUser.user?.role == "EDITOR") ? (
                <EditButton
                  buttonText="Go to Edit Mode"
                  logoComponent={<FaRegEdit color="#FFFFFF" size={16} />}
                  onClick={() => router.push("/layer/" + params.id + "/edit")}
                />
              ) : null}
            </div>
            <div className="mt-4 text-lg">{layer?.description}</div>
            {pageWidth > 1024 ? null : (
              <MobileMap mapLocations={results} center={center} />
            )}

            <div className="text-xl mt-8 font-medium">Results:</div>
            {isLoadingResults ? (
              <PageCircleLoader />
            ) : results == undefined ||
              results == null ||
              results.length === 0 ? (
              <div>No Results</div>
            ) : (
              results.map((r: LayerResult, index) => {
                return (
                  <LayerResultDiv
                    key={index}
                    result={r}
                    setCenter={setCenter}
                  />
                )
              })
            )}
            <div className="flex flex-row gap-1">
              <div className="font-bold">Editor:</div>
              <div
                onClick={() => {
                  if (layer) router.push("/profile/" + layer.userDTO.id)
                }}
                className="font-medium cursor-pointer hover:text-gray-500 hover:underline">
                {layer?.userDTO.username}
              </div>
            </div>

            <div className="w-full h-20"></div>
          </div>

          {pageWidth > 1024 ? (
            <Map mapLocations={results} center={center} />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Layer
