"use client"
import DashboardResult from "@/components/dashboard/DashboardResult"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import { useCheckAuth } from "../../../utils/customHooks/useCheckAuth"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useQuery } from "react-query"
import { getAllUsers } from "../../../utils/customFunctions/dashboard"
import { User, UserRoleEnum } from "../../../utils/stateManagement/user"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import Paginator from "@/components/other/Paginator"

function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOption, setSelectedOption] = useState(
    searchParams.get("role") + ""
  )
  const [name, setName] = useState(searchParams.get("name") + "")
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value)
  }

  const checkAuth = useCheckAuth(router, [UserRoleEnum.ADMIN])

  const [totalPages, setTotalPages] = useState<number>(1)

  function changeToUrlParam(urlName: string, value: string) {
    const currentUrl = window.location.href

    // Create a new URL object
    const url = new URL(currentUrl)

    // Get the search parameters from the URL
    const searchParams = new URLSearchParams(url.search)

    // Set or update the query parameter
    searchParams.set(urlName, value)

    // Update the URL object with the new search parameters
    url.search = searchParams.toString()

    // Use history.pushState to update the browser's URL without reloading the page
    history.pushState({}, "", url.toString())
  }
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery(
    [
      "users",
      searchParams.get("name") != null ? searchParams.get("name") : "",
      searchParams.get("role") != null ? searchParams.get("role") : "",
      searchParams.get("page") != null ? Number(searchParams.get("page")) : 1,
    ],
    async () => {
      try {
        const data = await getAllUsers(
          selectedOption,
          searchParams.get("name"),
          searchParams.get("page")
        )
        if (data == null) {
          //setCurPage(1)
          changeToUrlParam("page", "1")
          setSelectedOption("")
          setName("")
          refetchUsers()
          return []
        }
        setTotalPages(data.totalPages)
        //setCurPage(data.currentPage + 1)

        return data.users
      } catch (error) {
        //setCurPage(Number(searchParams.get("page")))

        return []
      }
    },
    {
      enabled: checkAuth.isRenderLoader == false,
    }
  )

  useEffect(() => {
    refetchUsers()
  }, [searchParams.get("page")])

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
                  value={name}
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
                  <option value={UserRoleEnum.EDITOR}>Editors</option>
                  <option value={UserRoleEnum.ADMIN}>Admins</option>
                </select>
              </div>
              <div className="ml-auto">
                <DarkBlueButton
                  onClick={() => {
                    changeToUrlParam("name", name)
                    changeToUrlParam("role", selectedOption)
                    changeToUrlParam("page", "1")
                    refetchUsers()
                  }}
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
                  <DashboardResult
                    key={u.id}
                    user={u}
                    refetchUsers={refetchUsers}
                    curName={searchParams.get("name") + ""}
                    curRole={searchParams.get("role") + ""}
                    curPage={
                      searchParams.get("page") !== undefined &&
                      searchParams.get("page") !== null &&
                      searchParams.get("page") != ""
                        ? Number(searchParams.get("page"))
                        : 1
                    }
                  />
                ))
              )}
            </div>
            <Paginator
              curPage={
                searchParams.get("page") != null
                  ? Number(searchParams.get("page"))
                  : 1
              }
              totalPages={totalPages}
              scrollToTop={true}
            />
          </div>
        </div>
      </>
    )
}

export default Dashboard
