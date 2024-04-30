import axios from "../axiosHandler"
import { User } from "./user"


async function getAllUsers(role: string | null, name: string | null): Promise<User[] | null> {
    try {
        const response = await axios.get("/users?name=" + name + "&role=" + role)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return null;
    }

}

export { getAllUsers }