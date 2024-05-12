import { create } from "zustand"
import Cookies from 'js-cookie'
import axios from "../axiosHandler"
import axiosNoAuth from "../axiosNoAuth"

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
    registerUser: (username: string, password: string, repeat_password: string, email: string) => Promise<string>
    signOutUser: () => void
    isUserAuth: () => boolean
    refreshUser: () => Promise<void>
}

// SIGN IN / SIGN OUT / REGISTER
async function signIn(username: string, password: string) {
    try {
        const response = await axiosNoAuth.post("/auth/signin", { username, password })
        console.log(response)
        return response.data;
    } catch (error) {
        console.error(error)
        signOut()
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

async function registerUser(username: string, password: string, repeat_password: string, email: string): Promise<string> {
    if (username == "" || password == "" || repeat_password == "" || email == "") {
        return "One or more camps are empty"
    }
    if (password != repeat_password) {
        return "Passwords do not match"
    }
    try {
        await axiosNoAuth.post("/auth/signup", { username, password, email })
        return "Success"
    } catch (error) {
        console.error(error)
        return "Unknown error"
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
        const data = await signIn(username, password)
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

export { useUserState, getUserByID }
export type { User }
