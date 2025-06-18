import axios from "axios";

const client = axios.create({
     /* baseURL: "http://localhost:3999/api" */ 
    baseURL: import.meta.env.VITE_API_BASE_URL
});
    
client.interceptors.request.use(
    (config) => {
        if(!config.url.includes("/users/login")) {
            const store = JSON.parse(localStorage.getItem("store"));
            const token = store ? store.token : "";
            config.headers.Authorization = `Bearer ${token}`;
        }   

        if (config.url.includes("/invoice")) {
            config.responseType = 'blob'; 
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default client;
