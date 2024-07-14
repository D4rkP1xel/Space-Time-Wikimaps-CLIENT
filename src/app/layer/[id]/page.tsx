"use client"
import { FaAngleLeft, FaRegTrashAlt, FaUserEdit } from "react-icons/fa"
import { IoReload } from "react-icons/io5"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { useQuery } from "react-query"
import {
  LayerResult,
  deleteLayer,
  getLayer,
  getLayerResults,
} from "../../../../utils/customFunctions/layers"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import LayerResultDiv from "@/components/layer/LayerResult"
import { FaRegEdit } from "react-icons/fa"
import EditButton from "@/components/buttons/EditButton"
import {
  UserRoleEnum,
  useUserState,
} from "../../../../utils/stateManagement/user"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import MapFullScreen from "@/components/maps/MapFullScreen"
import SideMap from "@/components/maps/SideMap"
import toast from "react-hot-toast"
import HorizontalMap from "@/components/maps/HorizontalMap"
import Paginator from "@/components/other/Paginator"
import DeclineButton from "@/components/buttons/DeclineButton"
import { FiX } from "react-icons/fi"

function Layer({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [pageWidth, setPageWidth] = useState(window.innerWidth)
  const [center, setCenter] = useState<[number, number] | null>(null)
  const useUser = useUserState()
  const [startYear, setStartYear] = useState<number>(0)
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear())
  const [isLoadingResultsAux, setIsLoadingResultsAux] = useState(false)
  const [isFullscreen, setFullscreen] = useState(false)
  const [pageResults, setPageResults] = useState<LayerResult[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isDeleting, setDeleting] = useState(false)
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
    },
    {
      enabled: params.id != null,
    }
  )

  async function DeleteLayer() {
    try {
      if (layer?.id == null) return
      await deleteLayer(layer?.id)
      router.push("/")
      toast.success("Layer deleted successfully!")
    } catch (error) {
      console.error(error)
    }
  }

  const {
    data: results,
    isLoading: isLoadingResults,
    refetch: refetchResults,
  } = useQuery(
    ["results", params.id],
    async () => {
      try {
        if (layer == null) return null
        const data = await getLayerResults(layer.id, startYear, endYear)
        let arr = []

        let page = Number(searchParams.get("page"))
          ? Number(searchParams.get("page"))
          : 1
        for (let i = (page - 1) * 5; i < page * 5; i++) {
          if (data[i]) arr.push(data[i])
        }
        setPageResults(arr)
        setTotalPages(Math.ceil(data.length / 5))
        return data
      } catch (error) {
        console.error(error)
        router.back()
      }
    },
    { enabled: layer != null && params.id != null, refetchOnMount: "always" }
  )

  useEffect(() => {
    if (
      results &&
      results.length > 0 &&
      searchParams.get("page") &&
      Number(searchParams.get("page")) > 0
    ) {
      let arr = []
      for (
        let i = (Number(searchParams.get("page")) - 1) * 5;
        i < Number(searchParams.get("page")) * 5;
        i++
      ) {
        if (results[i]) arr.push(results[i])
      }
      setPageResults(arr)
    } else setPageResults([])
  }, [searchParams.get("page")])

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
              ? { width: `calc(100% - 450px)` }
              : pageWidth > 1024
              ? { width: `calc(100% - 350px)` }
              : { width: "100%" }
          }>
          <div
            className={
              pageWidth > 1024 ? "w-full lg:pr-32 pr-48 z-10" : "w-full z-10"
            }>
            <div
              className="flex flex-row gap-4 cursor-pointer items-center select-none"
              onClick={() =>
                searchParams.get("goBack")
                  ? router.push(
                      "/?" + decodeURIComponent(searchParams.get("goBack") + "")
                    )
                  : router.push("/")
              }>
              <FaAngleLeft size={24} />
              <div className="text-md">Go Back</div>
            </div>
            <div className="mt-8 flex gap-8">
              <div className="text-3xl font-medium">{layer?.layerName}</div>
              {useUser.isUserAuth() &&
              (useUser.user?.role == UserRoleEnum.ADMIN ||
                (useUser.user?.role == UserRoleEnum.EDITOR &&
                  layer?.userDTO.id == useUser.user.id)) ? (
                <>
                  <EditButton
                    buttonText="Go to Edit Mode"
                    logoComponent={<FaRegEdit color="#FFFFFF" size={16} />}
                    onClick={() => router.push("/layer/" + params.id + "/edit")}
                  />
                  <DeclineButton
                    id="deleteLayer"
                    logoComponent={<FaRegTrashAlt color="#FFFFFF" size={16} />}
                    buttonText="Delete Layer"
                    onClick={() => setDeleting(true)}
                  />
                </>
              ) : null}
            </div>
            <div className="mt-4 text-lg">{layer?.description}</div>
            {pageWidth > 1024 ? null : (
              <HorizontalMap
                mapLocations={results}
                center={center}
                setFullscreen={setFullscreen}
              />
            )}
            <div className="flex xl:flex-row flex-col items-start mt-8">
              <div className="text-xl font-medium">Results:</div>
              <div className="xl:ml-auto xl:mt-0 mt-2 flex flex-row gap-3 items-center">
                <div>Start Year:</div>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="h-8 w-20 bg-gray-100 outline-none rounded-md"
                />
                <div>End Year:</div>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  className="h-8 w-20 bg-gray-100 outline-none rounded-md"
                />
                <div className="hidden xl:block">
                  <DarkBlueButton
                    onClick={async () => {
                      setIsLoadingResultsAux(true)
                      await refetchResults()
                      setIsLoadingResultsAux(false)
                    }}
                    buttonText="Reload Results"
                    logoComponent={<IoReload size={20} />}
                    isLoading={isLoadingResultsAux}
                  />
                </div>
                <div className="hidden md:block xl:hidden">
                  <DarkBlueButton
                    onClick={async () => {
                      setIsLoadingResultsAux(true)
                      await refetchResults()
                      setIsLoadingResultsAux(false)
                    }}
                    buttonText="Reload"
                    logoComponent={<IoReload size={20} />}
                    isLoading={isLoadingResultsAux}
                  />
                </div>
                <div className="block md:hidden">
                  <DarkBlueButton
                    onClick={async () => {
                      setIsLoadingResultsAux(true)
                      await refetchResults()
                      setIsLoadingResultsAux(false)
                    }}
                    buttonText=""
                    logoComponent={<IoReload size={20} />}
                    isLoading={isLoadingResultsAux}
                  />
                </div>
              </div>
            </div>

            {isLoadingResults ? (
              <PageCircleLoader />
            ) : results == undefined ||
              results == null ||
              results.length === 0 ||
              pageResults.length == 0 ? (
              <div>No Results</div>
            ) : (
              pageResults.map((r: LayerResult, index) => {
                return (
                  <LayerResultDiv
                    key={index}
                    result={r}
                    setCenter={setCenter}
                    pageWidth={pageWidth}
                  />
                )
              })
            )}

            <Paginator
              curPage={
                Number(searchParams.get("page"))
                  ? Number(searchParams.get("page"))
                  : 1
              }
              totalPages={totalPages}
              scrollToTop={true}
            />
            <div className="flex flex-row gap-1 items-center">
              <FaUserEdit color="#000000" size={24} />
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
            <SideMap
              mapLocations={results}
              center={center}
              setFullscreen={setFullscreen}
            />
          ) : null}
        </div>
      </div>

      {isFullscreen ? (
        <MapFullScreen mapLocations={results} setFullscreen={setFullscreen} />
      ) : null}

      {/* Delete Layer Modal */}
      {isDeleting === true ? (
        <div className="w-screen h-screen bg-gray-900 bg-opacity-50 z-50 fixed top-0 left-0 flex">
          <div
            id="deleteLayerModal"
            className="fixed top-16 right-2 p-8 cursor-pointer"
            onClick={() => {
              setDeleting(false)
            }}>
            <FiX color="#FFFFFF" size={48} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-[#828282] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
            <div className="text-2xl font-medium mx-auto mb-6">
              Are you sure you want to delete {layer?.layerName}?
            </div>
            <div className="flex justify-center">
              <DeclineButton
                id="deleteLayerButtonFinal"
                logoComponent={<FaRegTrashAlt size={20} />}
                buttonText="Delete Layer"
                onClick={() => {
                  DeleteLayer()
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
      {/* End of Delete Layer Modal*/}
    </>
  )
}

export default Layer
