"use client"
import CreateEditLayer from "@/components/createEditLayer/CreateEditLayer"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import React from "react"

function EditLayer({ params }: { params: { id: string } }) {
  if (params.id == null) return <PageCircleLoader />
  else return <CreateEditLayer layerId={params.id} />
}

export default EditLayer
