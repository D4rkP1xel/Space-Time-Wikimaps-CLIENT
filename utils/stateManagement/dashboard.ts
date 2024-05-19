import axios from "../axiosHandler"
import { User, Users } from "./user"

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

async function getAllUsers(role: string | null, name: string | null, page: string | null): Promise<Users | null> {
    if (page == null || page == "") page = "1"
    try {
        let url = "/users?page=" + (Number(page) - 1) + "&size=5"
        let searchRole = role != null && role != ""
        let searchName = name != null && name != ""
        if (searchRole || searchName) {
            if (searchName) url += "&name=" + name
            if (searchRole) url += "&role=" + role
        }

        const response = await axios.get(url)

        console.log(response)
        return response.data
    } catch (error) {
        console.error(error)
        return null;
    }

}


async function getAllEditorRequests(name: string | null, selectedStatus: string | null): Promise<EditorRequest[] | null> {
    try {
        let url = "/upgrade/requests"
        let searchStatus = selectedStatus != null && selectedStatus != ""
        let searchName = name != null && name != ""
        if (searchStatus || searchName) {
            url += "?"
            if (searchName && searchStatus) {
                url += "name=" + name + "&status=" + selectedStatus
            }
            else if (searchName) url += "name=" + name
            else if (searchStatus) url += "status=" + selectedStatus
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