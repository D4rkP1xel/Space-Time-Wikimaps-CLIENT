import { create } from "zustand"
import Cookies from 'js-cookie'
import axios from "../axiosHandler"
import axiosNoAuth from "../axiosNoAuth"
import { AxiosError } from "axios"

// TYPES
interface User {
    id: number
    username: string
    email: string
    role: string
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
        const id = Cookies.get('userId')
        const response = await axios.get("/users/id/" + id)
        //console.log(response)
        return response.data;
    } catch (error) {
        console.error(error)
        signOut()
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
    try {
        const response = await axios.put("/users/" + id + "/password", { oldPassword, newPassword })
        //console.log(response)
        alert("Password changed successfully")
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

async function changeSettingsUser(username: string, email: string): Promise<string | undefined> {
    if (username == null || username == "" || email == null || email == "") {
        throw ("One or more camps are empty.")
    }
    try {
        const response = await axios.put("/user", { username, email })
        storeTokens(response.data.accessToken, response.data.refreshToken, response.data.user.id)
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
    try {
        const response = await axios.post("/upgrade/request", { message })
        //console.log(response)
        alert("Request sent successfully")
        return response.data;
    } catch (error) {
        console.error(error)
    }
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
function storeTokens(access_token: string, refresh_token: string, user_id: number) {
    if (access_token != null && refresh_token != null && user_id != null) {
        Cookies.set('accessToken', access_token);
        Cookies.set('refreshToken', refresh_token);
        Cookies.set('userId', user_id.toString());
    }
}

function cleanTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userId')
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
            storeTokens(data.accessToken, data.refreshToken, data.user.id)
            const user = data.user
            set(() => {
                return { user: user }
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

        if (Cookies.get("userId") != null) {
            const data = await refreshUser()
            if (data) {
                const user: User = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    role: data.role,
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

export { useUserState, getUserByID, changePasswordUser, askToBeEditorUser, changeSettingsUser }
export type { User }
