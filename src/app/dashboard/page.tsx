"use client"
import DashboardResult from "@/components/dashboard/DashboardResult"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { useCheckAuth } from "../../../utils/customHooks/checkAuth"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useQuery } from "react-query"
import { getAllUsers } from "../../../utils/stateManagement/dashboard"
import { User } from "../../../utils/stateManagement/user"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"

function Dashboard() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState("")
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value)
  }
  const checkAuth = useCheckAuth(router, ["ADMIN"])
  const [name, setName] = useState("")
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery(
    ["users"],
    async () => {
      return await getAllUsers(selectedOption, name)
    },
    { enabled: checkAuth.isRenderLoader == false }
  )

  if (checkAuth.isRenderLoader) {
    return <PageCircleLoader />
  } else
    return (
      <>
        <div className="flex flex-col w-full xl:px-24 px-12 pt-12">
          <div className="text-4xl font-medium text-center w-full">
            User Dashboard
          </div>
          <div className="flex flex-col">
            <div className="flex mt-12">
              <div className="flex gap-4 bg-gray-100 items-center py-1 pl-4 pr-1 rounded-full">
                <FaSearch color="#000000" size={16} />
                <input
                  type="text"
                  className="bg-gray-100 lg:w-80 md:w-60 w-40 text-black border-none outline-none font-medium"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex ml-12 items-center">
                <div className="font-medium text-md mr-2">Role:</div>
                <select
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="border-black border-2 outline-none w-32">
                  <option value="">All</option>
                  <option value="USER">Users</option>
                  <option value="EDITOR">Editors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
              <div className="ml-auto">
                <DarkBlueButton
                  onClick={() => refetchUsers()}
                  logoComponent={<FaSearch color="#FFFFFF" size={16} />}
                  buttonText="Search"
                />
              </div>
            </div>
            <div className="flex flex-col mt-8">
              {isLoadingUsers ? (
                <PageCircleLoader />
              ) : users == null || users.length == 0 ? (
                "No users found"
              ) : (
                users.map((u: User) => (
                  <DashboardResult key={u.id} role={u.role} name={u.username} id={u.id} />
                ))
              )}
            </div>
          </div>
        </div>
      </>
    )
}

export default Dashboard
