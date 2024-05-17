import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useEffect, useState } from "react"
import { useUserState } from "../stateManagement/user"

export function useCheckAuth(router: AppRouterInstance, rolesAllowed: string[]) {
    const useUser = useUserState()
    const [isRenderLoader, setRenderLoader] = useState(true)
    useEffect(() => {
        if (
            useUser.didFetchUser &&
            (!useUser.isUserAuth() || (useUser.user != null && rolesAllowed.indexOf(useUser.user.role) === -1))
        ) {
            router.push("/")
        }
        if (!useUser.didFetchUser || (useUser.didFetchUser && (!useUser.isUserAuth() || (useUser.user != null && rolesAllowed.indexOf(useUser.user.role) === -1)))) {
            setRenderLoader(true)
        }
        else setRenderLoader(false)
    }, [router, useUser.didFetchUser, useUser.isUserAuth(), useUser.user, rolesAllowed])

    return { isRenderLoader };
}
