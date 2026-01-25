import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_VICAR_BACKEND;


export const createAccount = `${API_BASE_URL}/api/createAccount`;
export const loginAccount = `${API_BASE_URL}/api/adminLogin`;
