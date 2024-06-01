import axios from "axios";


// Access environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with the base URL
export default axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } })