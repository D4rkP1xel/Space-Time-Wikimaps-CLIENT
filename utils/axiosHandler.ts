import axios from "axios";
import Cookies from 'js-cookie'


// Access environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const access_token = Cookies.get('accessToken')

// Create axios instance with the base URL
export default axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' } });