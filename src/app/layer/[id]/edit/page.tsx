"use client"
import CreateEditLayer from "@/components/createEditLayer/CreateEditLayer"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useRouter } from "next/navigation"
import React from "react"
import { useCheckAuth } from "../../../../../utils/customHooks/useCheckAuth"
import { UserRoleEnum } from "../../../../../utils/stateManagement/user"

function EditLayer({ params }: { params: { id: string } }) {
  const router = useRouter()
  const checkAuth = useCheckAuth(router, [
    UserRoleEnum.ADMIN,
    UserRoleEnum.EDITOR,
  ])
  if (checkAuth.isRenderLoader) {
    return <PageCircleLoader />
  } else if (params.id == null) return <PageCircleLoader />
  else return <CreateEditLayer layerId={params.id} />
}

export default EditLayer
