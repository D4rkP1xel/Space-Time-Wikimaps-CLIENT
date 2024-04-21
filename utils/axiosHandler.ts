import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Access environment variables
const API_URL = process.env.API_URL;

// Create axios instance with the base URL
export default axios.create({ baseURL: API_URL });