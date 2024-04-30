import axios from "../axiosHandler"
import { User } from "./user"


async function getAllUsers(): Promise<User[] | null> {
    try {
        const response = await axios.get("/users")
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return null;
    }

}

export { getAllUsers }