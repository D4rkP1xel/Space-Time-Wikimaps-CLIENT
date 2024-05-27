"use client"
import CreateEditLayer from "@/components/createEditLayer/CreateEditLayer"
import { useRouter } from "next/navigation"
import React from "react"
import { useCheckAuth } from "../../../utils/customHooks/checkAuth"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { UserRoleEnum } from "../../../utils/stateManagement/user"

function CreateLayer() {
  const router = useRouter()
  const checkAuth = useCheckAuth(router, [
    UserRoleEnum.ADMIN,
    UserRoleEnum.EDITOR,
  ])
  if (checkAuth.isRenderLoader) {
    return <PageCircleLoader />
  } else return <CreateEditLayer layerId={null} />
}

export default CreateLayer
