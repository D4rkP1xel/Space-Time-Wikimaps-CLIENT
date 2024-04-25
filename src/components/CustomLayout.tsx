import React from "react"
import Header from "./main/Header"
import { useUserState } from "../../utils/stateManagement/user"
import { useQuery } from "react-query"
import { useRouter } from "next/navigation"

function CustomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const useUser = useUserState()
  const { data: user } = useQuery(
    ["refreshUser"],
    async () => await useUser.refreshUser()
  )

  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default CustomLayout
