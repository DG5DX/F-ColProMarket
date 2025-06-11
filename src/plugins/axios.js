import axios from "axios";

const client = axios.create({
<<<<<<< HEAD
     baseURL: "http://localhost:3999/api" 
   /* baseURL: "https://backend-proyectofinal-vrso.onrender.com/api"*/
=======
    baseURL: "http://localhost:3999/api"
    /* baseURL: "https://backend-proyectofinal-vrso.onrender.com/api" */
>>>>>>> c042dd3f9d7efe3c764363ade644f64570d5a6b2
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
