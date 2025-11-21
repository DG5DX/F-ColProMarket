import client from "../plugins/axios.js";
import { toRaw } from "vue";

export async function getData(url) {
    try {
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        console.error('error en la peticion GET', error);
        throw error;
    }
} 

export async function postData(url, data,){
    try {
        console.log("data", toRaw(data));
        const response = await client.post(url, data);
        return response.data;
    } catch (error){
        console.error('Error en la peticion POST', error);
        throw error;
    }
}



export async function putData(url, data) {
    try {
        const response = await client.put(url,data);
        return response.data;
    } catch (error) {
        console.error('error en la peticion PUT', error);
        throw error;    
    }
}

export async function DownloadInvoicePdf(url, data,){
    try {
        console.log("data", toRaw(data));
        const response = await client.post(url, data);
        return response;
    } catch (error){
        console.error('Error en la peticion POST', error);
        throw error;
    }
}