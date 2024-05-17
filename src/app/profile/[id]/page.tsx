"use client"
import React, { use, useEffect, useState } from "react"
import {
  getUserByID,
  useUserState,
} from "../../../../utils/stateManagement/user"
import { FaUser, FaUserEdit, FaUserShield } from "react-icons/fa"
import { useQuery } from "react-query"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useCheckAuth } from "../../../../utils/customHooks/checkAuth"
import { useRouter } from "next/navigation"
import {
  Layer,
  getAllLayersByUserId,
} from "../../../../utils/stateManagement/layers"
import ProfileLayersResult from "@/components/profile/ProfileLayersResult"

function Profile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const checkAuth = useCheckAuth(router, ["ADMIN", "EDITOR", "USER"])
  const useUser = useUserState()
  const [isProfileOwner, setIsProfileOwner] = useState(false)

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
      enabled:
        !checkAuth.isRenderLoader() && !isProfileOwner && params.id != null,
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
        return data
      } catch (error) {
        console.error(error)
      }
    },
    {
      enabled:
        (checkAuth.isRenderLoader() == false &&
          params.id != null &&
          isProfileOwner &&
          (useUser.user?.role == "EDITOR" || useUser.user?.role == "ADMIN")) ||
        (!isProfileOwner && (user?.role == "EDITOR" || user?.role == "ADMIN")),
    }
  )

  if (checkAuth.isRenderLoader()) {
    return <PageCircleLoader />
  } else {
    return (
      <>
        <div className="flex flex-col mb-12 w-full xl:px-48 px-24 pt-12 z-0">
          <div className="font-bold text-4xl mb-12 text-center">Profile</div>
          <div className="flex flex-col mx-auto w-[720px] gap-2 mb-12">
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
                    useUser.user.role == "ADMIN" ? (
                      <FaUserShield color="#000000" size={24} />
                    ) : useUser.user.role == "EDITOR" ? (
                      <FaUserEdit color="#000000" size={24} />
                    ) : (
                      <FaUser color="#000000" size={24} />
                    )
                  ) : user?.role == "ADMIN" ? (
                    <FaUserShield color="#000000" size={24} />
                  ) : user?.role == "EDITOR" ? (
                    <FaUserEdit color="#000000" size={24} />
                  ) : (
                    <FaUser color="#000000" size={24} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {(isProfileOwner &&
            (useUser.user?.role == "EDITOR" ||
              useUser.user?.role == "ADMIN")) ||
          (!isProfileOwner &&
            (user?.role == "EDITOR" || user?.role == "ADMIN")) ? (
            <div>
              <div className="flex flex-row mb-12">
                <span className=" text-lg font-bold text ">
                  {isProfileOwner
                    ? "Your "
                    : isLoadingUser
                    ? ""
                    : user?.username}{" "}
                  Layers:
                </span>
              </div>

              <div className="flex flex-row justify-center mb-12">
                <div className="flex flex-col mt-8">
                  {isLoadingLayers ? (
                    <PageCircleLoader />
                  ) : layers == null || layers.length == 0 ? (
                    "No Layers found"
                  ) : (
                    layers.map((l: Layer) => (
                      <ProfileLayersResult key={l.id} name={l.layerName} />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </>
    )
  }
}

export default Profile
