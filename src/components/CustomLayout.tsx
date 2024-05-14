import React from "react"
import Header from "./main/Header"
import { useUserState } from "../../utils/stateManagement/user"
import { useQuery } from "react-query"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"

function CustomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const useUser = useUserState()
  const { data: user } = useQuery(
    ["refreshUser"],
    async () => await useUser.refreshUser()
  )

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          // Define default options
          duration: 5000,
        }}
      />
      <Header />
      {children}
    </>
  )
}

export default CustomLayout
