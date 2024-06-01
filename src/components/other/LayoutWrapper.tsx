import { useQuery } from "react-query"
import { Toaster } from "react-hot-toast"
import { useUserState } from "../../../utils/stateManagement/user"
import Header from "../main/Header"

function LayoutWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const useUser = useUserState()
  const { data: user } = useQuery(
    ["auth_user"],
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

export default LayoutWrapper
