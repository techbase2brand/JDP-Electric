import axios from "axios";

export const API_BASE_URL = "https://jdpbackend.prorevv.com/api";
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;

/* axios instance */

//Login API 
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
