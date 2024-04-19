"use client"
import DashboardResult from "@/components/dashboard/DashboardResult"
import Header from "@/components/main/Header"
import React, { useState } from "react"
import { FaSearch } from "react-icons/fa"

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("")

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value)
  }
  return (
    <>
      <Header />
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
              />
            </div>
            <div className="flex ml-12 items-center">
              <div className="font-medium text-md mr-2">Role:</div>
              <select
                value={selectedOption}
                onChange={handleOptionChange}
                className="border-black border-2 outline-none w-32">
                <option value="all">All</option>
                <option value="users">Users</option>
                <option value="editors">Editors</option>
                <option value="admins">Admins</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            {/*Results*/}
            <DashboardResult />
            <DashboardResult />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
