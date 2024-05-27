"use client"
import React, { useEffect, useState } from "react"
import {
  UserRoleEnum,
  getUserByID,
  useUserState,
} from "../../../../utils/stateManagement/user"
import { FaUser, FaUserEdit, FaUserShield } from "react-icons/fa"
import { useQuery } from "react-query"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Layer,
  getAllLayersByUserId,
} from "../../../../utils/stateManagement/layers"
import ProfileLayersResult from "@/components/profile/ProfileLayersResult"
import Paginator from "@/components/other/Paginator"

function Profile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const useUser = useUserState()
  const [isProfileOwner, setIsProfileOwner] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [pageResults, setPageResults] = useState<Layer[]>([])

  useEffect(() => {
    setIsProfileOwner(useUser.user?.id.toString() == params.id)
  }, [useUser.user, params.id])
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery(
    ["user", params.id],
    async () => {
      return await getUserByID(params.id)
    },
    {
      enabled: !isProfileOwner && params.id != null,
    }
  )

  const {
    data: layers,
    isLoading: isLoadingLayers,
    refetch: refetchLayers,
  } = useQuery(
    ["profileLayers", params.id],
    async () => {
      try {
        const data = await getAllLayersByUserId(params.id)
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
      }
    },
    {
      enabled:
        (params.id != null &&
          isProfileOwner &&
          (useUser.user?.role == UserRoleEnum.EDITOR ||
            useUser.user?.role == UserRoleEnum.ADMIN)) ||
        (!isProfileOwner &&
          (user?.role == UserRoleEnum.EDITOR ||
            user?.role == UserRoleEnum.ADMIN)),
      refetchOnMount: "always",
    }
  )

  useEffect(() => {
    if (
      layers &&
      layers.length > 0 &&
      searchParams.get("page") &&
      Number(searchParams.get("page")) > 0
    ) {
      let arr = []
      for (
        let i = (Number(searchParams.get("page")) - 1) * 5;
        i < Number(searchParams.get("page")) * 5;
        i++
      ) {
        if (layers[i]) arr.push(layers[i])
      }
      setPageResults(arr)
    } else setPageResults([])
  }, [searchParams.get("page")])

  return (
    <>
      <div className="flex flex-col mb-12 w-full xl:px-48 px-24 pt-12 z-0">
        <div className="font-bold text-4xl mb-12 text-center">Profile</div>
        <div className="flex flex-col gap-2 mb-12 xl:ml-40 lg:ml-32 md:ml-20 ml-0">
          <div className="flex flex-row ">
            <div className="flex flex-row gap-1">
              <span className=" text-lg font-bold w-16">Name: </span>
              <span className=" text-lg ">
                {isProfileOwner
                  ? useUser.user?.username
                  : isLoadingUser
                  ? ""
                  : user?.username}
              </span>
            </div>
          </div>
          <div className="flex flex-row ">
            <div className="flex flex-row gap-1">
              <span className=" text-lg font-bold w-16">Email:</span>
              <span className=" text-lg ">
                {isProfileOwner
                  ? useUser.user?.email
                  : isLoadingUser
                  ? ""
                  : user?.email}
              </span>
            </div>
          </div>
          <div className="flex flex-row  mb-6">
            <div className="flex flex-row items-center">
              <span className=" text-lg font-bold w-16">Role:</span>
              <span className=" px-1 py-1 ">
                {isProfileOwner
                  ? useUser.user?.role
                  : isLoadingUser
                  ? null
                  : user?.role}
              </span>

              <div>
                {isProfileOwner && useUser.user?.role ? (
                  useUser.user.role == UserRoleEnum.ADMIN ? (
                    <FaUserShield color="#000000" size={24} />
                  ) : useUser.user.role == UserRoleEnum.EDITOR ? (
                    <FaUserEdit color="#000000" size={24} />
                  ) : (
                    <FaUser color="#000000" size={24} />
                  )
                ) : user?.role == UserRoleEnum.ADMIN ? (
                  <FaUserShield color="#000000" size={24} />
                ) : user?.role == UserRoleEnum.EDITOR ? (
                  <FaUserEdit color="#000000" size={24} />
                ) : (
                  <FaUser color="#000000" size={24} />
                )}
              </div>
            </div>
          </div>
        </div>
        {(isProfileOwner &&
          (useUser.user?.role == UserRoleEnum.EDITOR ||
            useUser.user?.role == UserRoleEnum.ADMIN)) ||
        (!isProfileOwner &&
          (user?.role == UserRoleEnum.EDITOR ||
            user?.role == UserRoleEnum.ADMIN)) ? (
          <div>
            <div className="flex flex-row mb-4">
              <span className=" text-lg font-bold text ">
                {isProfileOwner ? "Your " : isLoadingUser ? "" : user?.username}{" "}
                Layers:
              </span>
            </div>

            <div className="flex flex-row justify-center mb-12">
              <div className="flex flex-col mt-8 w-full">
                {isLoadingLayers ? (
                  <PageCircleLoader />
                ) : layers == null ||
                  layers.length == 0 ||
                  pageResults.length == 0 ? (
                  "No Layers found"
                ) : (
                  pageResults.map((l: Layer) => (
                    <ProfileLayersResult
                      key={l.id}
                      name={l.layerName}
                      id={l.id}
                    />
                  ))
                )}
              </div>
            </div>

            <Paginator
              curPage={
                Number(searchParams.get("page"))
                  ? Number(searchParams.get("page"))
                  : 1
              }
              totalPages={totalPages}
              scrollToTop={true}
            />
          </div>
        ) : null}
      </div>
    </>
  )
}

export default Profile
