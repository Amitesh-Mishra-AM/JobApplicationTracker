import axios from "axios";
import { config } from "dotenv";
import { meta } from "eslint-plugin-react-hooks";
const api= axios.create({
    baseUrl: meta.env.VITE_API_URL
})
api.interceptors.use((config)=>{
    const token= localStorage.getItem("token")
    if(token){
        config.headers.Authorization= `Bearer ${token}`;
    }
    return config;
})

export default api;