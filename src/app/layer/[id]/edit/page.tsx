import CreateEditLayer from "@/components/createEditLayer/CreateEditLayer"
import React from "react"

function EditLayer({ params }: { params: { id: string } }) {
  return <CreateEditLayer layerId={params.id} />
}

export default EditLayer
