"use client"
import Header from "@/components/main/Header"
import { FaAngleLeft } from "react-icons/fa"
import { FaMapMarkerAlt } from "react-icons/fa"
import { FaBookOpen } from "react-icons/fa"
import Map from "@/components/main/Map"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MobileMap from "@/components/layer/MobileMap"

function Layer() {
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
            <div className="text-3xl mt-8 font-medium">
              Celebridades de Portugal
            </div>
            <div className="mt-4 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure Leiria in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            {pageWidth > 1024 ? null : <MobileMap />}

            <div className="text-xl mt-8 font-medium">Results:</div>
            <div className="flex lg:flex-row flex-col gap-8 mt-4 ">
              <div className="flex h-80 w-80 aspect-square lg:mx-0 mx-auto">
                <img
                  className="w-full h-full object-cover"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/640px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="text-2xl font-semibold">
                    Cristiano Ronaldo
                  </div>
                  <div className="flex flex-row lg:ml-4 ml-auto">
                    <div className="flex flex-row items-center gap-2 select-none cursor-pointer">
                      <FaMapMarkerAlt size={16} />
                      <div className="text-md font-medium">View On Map</div>
                    </div>
                    <div className="flex flex-row lg:ml-6 ml-4 items-center gap-2 select-none cursor-pointer">
                      <FaBookOpen size={16} />
                      <div className="text-md font-medium">Read about</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-gray-600 font-normal text-md">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris.
                </div>
              </div>
            </div>
            <div className="w-full h-20"></div>
          </div>
          {pageWidth > 1024 ? <Map /> : null}
        </div>
      </div>
    </>
  )
}

export default Layer
