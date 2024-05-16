import React from "react"
import { FaEye } from "react-icons/fa"
import DarkBlueButton from "../buttons/DarkBlueButton"
function ProfileLayersResult({name }: { name: string }) {
  return (
    <div className="flex w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center mb-6">

      <div className="font-medium text-xl ml-3">{name}</div>
      <div className="ml-auto">
        <DarkBlueButton
          onClick={() => null}
          logoComponent={<FaEye size={20} />}
          buttonText="Profile"
        />
      </div>
    </div>
  )
}

export default ProfileLayersResult
