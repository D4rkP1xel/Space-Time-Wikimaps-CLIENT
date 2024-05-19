"use client"
import DashboardResult from "@/components/dashboard/DashboardResult"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import { useCheckAuth } from "../../../utils/customHooks/checkAuth"
import PageCircleLoader from "@/components/loaders/PageCircleLoader"
import { useQuery } from "react-query"
import { getAllUsers } from "../../../utils/stateManagement/dashboard"
import { User } from "../../../utils/stateManagement/user"
import DarkBlueButton from "@/components/buttons/DarkBlueButton"
import Paginator from "@/components/other/Paginator"

function Dashboard() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState("")
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value)
  }
  const searchParams = useSearchParams()
  const checkAuth = useCheckAuth(router, ["ADMIN"])
  const [name, setName] = useState("")
  const [curPage, setCurPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoadingResultsAux, setIsLoadingResultsAux] = useState(false)

  function changeToPage(page: number) {
    const currentUrl = window.location.href

    // Create a new URL object
    const url = new URL(currentUrl)

    // Get the search parameters from the URL
    const searchParams = new URLSearchParams(url.search)

    // Set or update the query parameter
    searchParams.set("page", page.toString())

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
    ["users"],
    async () => {
      setIsLoadingResultsAux(true)
      try {
        const data = await getAllUsers(
          selectedOption,
          name,
          searchParams.get("page")
        )
        if (data == null) {
          setCurPage(1)
          changeToPage(1)
          setSelectedOption("")
          setName("")
          refetchUsers()
          return []
        }
        setTotalPages(data.totalPages)
        setCurPage(data.currentPage + 1)
        setIsLoadingResultsAux(false)
        return data.users
      } catch (error) {
        setCurPage(Number(searchParams.get("page")))
        setIsLoadingResultsAux(false)
        return []
      }
    },
    { enabled: checkAuth.isRenderLoader == false }
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
                  onClick={() => {
                    changeToPage(1)
                    refetchUsers()
                  }}
                  logoComponent={<FaSearch color="#FFFFFF" size={16} />}
                  buttonText="Search"
                />
              </div>
            </div>
            <div className="flex flex-col mt-8">
              {isLoadingUsers || isLoadingResultsAux ? (
                <PageCircleLoader />
              ) : users == null || users.length == 0 ? (
                "No users found"
              ) : (
                users.map((u: User) => (
                  <DashboardResult
                    key={u.id}
                    role={u.role}
                    name={u.username}
                    id={u.id}
                    block={u.blocked}
                    refetchFunction={refetchUsers}
                  />
                ))
              )}
            </div>
            <Paginator curPage={curPage} totalPages={totalPages} />
          </div>
        </div>
      </>
    )
}

export default Dashboard
