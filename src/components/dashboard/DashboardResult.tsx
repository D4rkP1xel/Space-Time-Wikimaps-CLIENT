import React from "react"
import { FaUserShield } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import DarkBlueButton from "../buttons/DarkBlueButton"
function DashboardResult({ role, name }: { role: string; name: string }) {
  return (
    <div className="flex w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center mb-6">
      {role === "ADMIN" ? (
        <FaUserShield color="#000000" size={32} />
      ) : (
        <FaUser color="#000000" size={32} />
      )}

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

export default DashboardResult
