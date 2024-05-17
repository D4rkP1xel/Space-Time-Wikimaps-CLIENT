import React from "react"
import { FaLock, FaTrash, FaUserEdit, FaUserShield } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import DarkBlueButton from "../buttons/DarkBlueButton"
import { useRouter } from "next/navigation"
import DeclineButton from "../buttons/DeclineButton"
function DashboardResult({ role, name ,id }: { role: string; name: string , id: number}) {
  const router = useRouter()
  return (
    <div className="flex w-full bg-gray-200 rounded-full shadow-lg py-8 px-12 items-center mb-6">
      {role === "ADMIN" ? (
        <FaUserShield color="#000000" size={32} />
      ) : role === "EDITOR" ? (
        <FaUserEdit color="#000000" size={32} />
      ) : (
        <FaUser color="#000000" size={32} />
      )}

      <div className="font-medium text-xl ml-3">{name}</div>
      <div className="flex flex-row items-center gap-2 ml-auto">
        <div >
          <DeclineButton
            onClick={() => router.push("/block/" + id)}
            logoComponent={<FaLock size={20} />}
            buttonText="Block User"
          />
        </div>
        <div >
          <DarkBlueButton
            onClick={() => router.push("/profile/" + id)}
            logoComponent={<FaEye size={20} />}
            buttonText="Profile"
          />
        </div>
        <div>
          <DeclineButton
            onClick={() => router.push("/users/" + id)}
            logoComponent={<FaTrash size={20} />}
            buttonText="Delete User"
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardResult
