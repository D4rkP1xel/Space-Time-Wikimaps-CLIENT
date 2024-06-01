import { create } from "zustand"
import Cookies from 'js-cookie'
import axios from "../axios/axiosHandler"
import axiosNoAuth from "../axios/axiosNoAuth"
import { AxiosError } from "axios"
import { EditorRequest } from "../customFunctions/dashboard"


// TYPES
enum UserRoleEnum {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    USER = 'USER'
}

interface User {
    id: number
    username: string
    email: string
    role: UserRoleEnum
    blocked: boolean
    roleUpgrade: EditorRequest | null
}

interface Users {
    users: User[]
    currentPage: number,
    totalItems: number,
    totalPages: number
}

interface userState {
    user: User | null
    didFetchUser: boolean
    signInUser: (username: string, password: string) => Promise<void>
    registerUser: (username: string, password: string, repeat_password: string, email: string) => Promise<void>
    signOutUser: () => void
    isUserAuth: () => boolean
    refreshUser: () => Promise<void>
}

// SIGN IN / SIGN OUT / REGISTER
async function signIn(username: string, password: string) {
    try {
        if (username == "" || password == "") {
            throw ("Fill in all necessary fields.")
        }
        const response = await axiosNoAuth.post("/auth/signin", { username, password })
        console.log(response)
        return response.data;
    } catch (error) {
        console.error(error)
        signOut()
        throw (error)
    }
}

function signOut() {
    try {
        //await axios.post("/auth/signout", { username }) //NOT IMPLEMENTED
        cleanTokens()
    } catch (error) {
        console.error(error)
    }
}
async function refreshUser() {
    try {

        const response = await axios.get("/user")
        console.log(response)
        return response.data;
    } catch (error) {
        console.error(error)
        //signOut()
    }
}

async function getUserByID(id: string): Promise<User | null> {
    try {
        const response = await axios.get("/users/id/" + id)
        //console.log(response)
        return response.data;
    } catch (error) {
        console.error(error)
        return null;
    }
}

async function changePasswordUser(id: string, oldPassword: string, newPassword: string): Promise<string | undefined> {
    if (oldPassword == null || oldPassword == "" || newPassword == "" || newPassword == null) throw ("One or more camps are empty.")
    if (newPassword.length < 6) throw ("New Password length has to be at least 6 characters long.")
    try {
        const response = await axios.put("/users/password", { oldPassword, newPassword })
        return response.data;
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError && error.response?.data?.message.startsWith("Validation failed:")) {
            throw (error.response.data.message.split(";")[0])
        }
        throw ("Unknown error.")
    }
}

async function deleteUser() {
    try {
        const response = await axios.delete("/user")
        console.log(response)

    } catch (error) {
        console.error(error)
    }
}

async function deleteUserById(id: number) {
    try {
        const response = await axios.delete("/users/" + id)
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}

async function blockUser(id: number) {
    try {
        const response = await axios.put("/admin/users/" + id + "/block")
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}

async function unblockUser(id: number) {
    try {
        const response = await axios.put("/admin/users/" + id + "/unblock")
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}

async function changeSettingsUser(obj: { username?: string, email?: string }): Promise<string | undefined> {

    try {
        const response = await axios.put("/user", obj)
        storeTokens(response.data.accessToken, response.data.refreshToken)
        return response.data;
    }
    catch (error) {
        //console.error(error)
        if (error instanceof AxiosError && error.response?.data?.message.startsWith("Validation failed:")) {
            throw (error.response.data.message.split(";")[0])
        }
        else if (error instanceof AxiosError && error.response?.data.message.includes("Username already exists")) {
            throw ("Username already exists.")
        }
        else if (error instanceof AxiosError && error.response?.data.message.includes("Email already registered")) {
            throw ("Email already registered.")
        }
        throw ("Unknown error.")
    }
}

async function askToBeEditorUser(message: string): Promise<string | undefined> {

    const response = await axios.post("/upgrade/request", { message })
    //console.log(response)
    return response.data;

}

async function registerUser(username: string, password: string, repeat_password: string, email: string): Promise<void> {
    if (username == "" || password == "" || repeat_password == "" || email == "") {
        throw ("One or more camps are empty.")
    }
    if (password != repeat_password) {
        throw ("Passwords do not match.")
    }
    try {
        await axiosNoAuth.post("/auth/signup", { username, password, email })
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError && error.response?.data?.message.startsWith("Validation failed:")) {
            throw (error.response.data.message.split(";")[0])
        }
        else if (error instanceof AxiosError && error.response?.data.message.includes("Username already exists")) {
            throw ("Username already exists.")
        }
        else if (error instanceof AxiosError && error.response?.data.message.includes("Email already registered")) {
            throw ("Email already registered.")
        }
        throw ("Unknown error.")
    }
}

// TOKENS
function storeTokens(access_token: string, refresh_token: string) {
    if (access_token != null && refresh_token != null) {
        Cookies.set('accessToken', access_token, { secure: true, sameSite: 'Strict' });
        Cookies.set('refreshToken', refresh_token, { secure: true, sameSite: 'Strict' });
    }
}

function cleanTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
}

function areCookiesValid() {
    if (Cookies.get('accessToken') != null && Cookies.get('refreshToken') != null) return true
    else return false
}
// USER STATE
const useUserState = create<userState>((set, get) => ({
    user: null,
    didFetchUser: false,
    registerUser: async (username: string, password: string, repeat_password: string, email: string) => {
        const response = await registerUser(username, password, repeat_password, email)
        return response
    },
    signInUser: async (username: string, password: string) => {
        let data
        try {
            data = await signIn(username, password)
        } catch (error) {
            throw (error)
        }

        if (data) {
            storeTokens(data.accessToken, data.refreshToken)
            const user = data.user
            set(() => {
                return { user: user, didFetchUser: true }
            })
        }
    },
    signOutUser: () => {
        signOut()
        set(() => {
            return { user: null }
        })
    },
    refreshUser: async () => {

        if (areCookiesValid()) {
            const data = await refreshUser()
            if (data) {
                const user: User = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    blocked: data.blocked,
                    roleUpgrade: data.roleUpgrade
                }
                return set(() => {
                    return { user: user, didFetchUser: true }
                })
            }
        }

        set(() => {
            return { user: null, didFetchUser: true }
        })

    },
    isUserAuth: () => {
        let user = get().user
        if (user == null) {
            return false
        }
        return true
    },

}))

export { UserRoleEnum, useUserState, getUserByID, changePasswordUser, askToBeEditorUser, changeSettingsUser, deleteUser, deleteUserById, blockUser, unblockUser }
export type { User, Users }
