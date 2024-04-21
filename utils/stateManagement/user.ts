import { create } from "zustand"
import Cookies from 'js-cookie'
import axios from "../axiosHandler"

// TYPES
interface User {
    id: number | null
    username: string | null
    email: string | null
    role: string | null
    access_token: string | null
    refresh_token: string | null
}

interface userState {
    user: User
    setUser: (newUser: User) => void
}

// SIGN IN / SIGN OUT / REGISTER
async function signIn(username: string, password: string) {
    try {
        await axios.post("/auth/signin", { username, password })
    } catch (error) {
        console.error(error)
    }
}

async function signOut(username: string) {
    try {
        await axios.post("/auth/signout", { username }) //NOT IMPLEMENTED
        cleanTokens()
    } catch (error) {
        console.error(error)
    }
}

async function registerUser(username: string, password: string, repeat_password: string, email: string): Promise<number> {
    if (password != repeat_password) {
        return -1
    }
    try {
        await axios.post("/auth/signup", { username, password, email })
        return 1
    } catch (error) {
        console.error(error)
        return -2
    }
}

// TOKENS
function storeTokens(user: User) {
    if (user.access_token != null && user.refresh_token != null) {
        Cookies.set('accessToken', user.access_token);
        Cookies.set('refreshToken', user.refresh_token);
    }
}

function cleanTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
}

function getTokens() {
    Cookies.get('accessToken');
    Cookies.get('refreshToken');
}

// USER STATE
const useUser = create<userState>((set) => ({
    user: { id: null, username: null, email: null, role: null, access_token: null, refresh_token: null },
    setUser: (newUser: User) =>
        set(() => {
            storeTokens(newUser)
            return { user: newUser }
        }),
    getTokens: () => getTokens()
}))

