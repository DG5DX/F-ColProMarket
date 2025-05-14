import { Notify } from "quasar";

export function showNotification (type, message){
    Notify.create({
        type:type,
        message:message
    })
}



