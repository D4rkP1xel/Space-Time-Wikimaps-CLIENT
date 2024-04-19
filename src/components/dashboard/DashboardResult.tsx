import React from "react"
import { FaUserShield } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
function DashboardResult() {
  return (
    <div className="flex w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center mb-6">
      <FaUserShield color="#000000" size={32} />
      <div className="font-medium text-xl ml-3">Orlando Lopes</div>
      <div className="ml-auto">
        <div className="flex flex-row items-center gap-2 select-none cursor-pointer bg-cyan-900 rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600">
          <FaEye size={20} />
          <div className="text-md font-medium text-lg">Profile</div>
        </div>
      </div>
    </div>
  )
}

export default DashboardResult
