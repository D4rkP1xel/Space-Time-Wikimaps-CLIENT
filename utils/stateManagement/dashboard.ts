import axios from "../axiosHandler"
import { User } from "./user"

interface EditorRequest {
    id: number,
    username: string,
    reason: string,
    timestamp: string,
    status: string
}

enum StatusEnum {
    DECLINED = 'DECLINED',
    ACCEPTED = 'ACCEPTED',
    PENDING = 'PENDING'
}

async function getAllUsers(role: string | null, name: string | null): Promise<User[] | null> {
    try {
        let url = "/users"
        let searchRole = role != null && role != ""
        let searchName = name != null && name != ""
        if (searchRole || searchName) {
            url += "?"
            if (searchName && searchRole) {
                url += "name=" + name + "&role=" + role
            }
            else if (searchName) url += "name=" + name
            else if (searchRole) url += "role=" + role
        }

        const response = await axios.get(url)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return null;
    }

}


async function getAllEditorRequests(name: string | null): Promise<EditorRequest[] | null> {
    try {
        let url = "/upgrade/requests"
        let searchName = name != null && name != ""
        if (searchName) {
            url += "?name=" + name
        }

        const response = await axios.get(url)
        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return null;
    }

}

async function updateEditorRequest(requestID: number, status: StatusEnum): Promise<undefined> {
    try {
        const response = await axios.put("/upgrade/request/" + requestID, { status, message: "null!!!!" })
        console.log(response)
        // return response.data
    } catch (error) {
        console.error(error)
        // return null;
    }

}
export { getAllUsers, getAllEditorRequests, updateEditorRequest, StatusEnum }
export type { EditorRequest }