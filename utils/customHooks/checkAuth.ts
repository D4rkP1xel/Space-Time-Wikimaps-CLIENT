import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useEffect } from "react"
import { useUserState } from "../stateManagement/user"

export function useCheckAuth(router: AppRouterInstance, rolesAllowed: string[]) {
    const useUser = useUserState()

    useEffect(() => {
        if (
            useUser.didFetchUser &&
            (!useUser.isUserAuth() || (useUser.user != null && rolesAllowed.indexOf(useUser.user.role) === -1))
        ) {
            router.push("/")
        }
    }, [router, useUser.didFetchUser, useUser.isUserAuth, useUser.user])

    function isRenderLoader() {
        if (!useUser.didFetchUser || (useUser.didFetchUser && (!useUser.isUserAuth() || (useUser.user != null && rolesAllowed.indexOf(useUser.user.role) === -1)))) {
            return true
        }
        return false
    }

    return { isRenderLoader };
}
