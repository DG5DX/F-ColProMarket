import axios from "axios";

const client = axios.create({
     baseURL: "http://localhost:3999/api" 
   /* baseURL: "https://backend-proyectofinal-vrso.onrender.com/api"*/

});

client.interceptors.request.use(
    (config) => {
        if(!config.url.includes("/users/login")) {
            const store = JSON.parse(localStorage.getItem("store"));
            const token = store ? store.token : "";
            config.headers.Authorization = `Bearer ${token}`;
        }   
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default client;
