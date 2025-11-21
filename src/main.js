import { createApp } from 'vue'
import App from './App.vue'
import {router} from "./routes/routes.js"
import { Quasar, Notify, Dialog } from 'quasar'
import './style.css'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import '@quasar/extras/line-awesome/line-awesome.css'

import { createPinia } from 'pinia'
import  piniaPluginPersistedState  from 'pinia-plugin-persistedstate'

// Import Quasar css
import 'quasar/src/css/index.sass'

//firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
    apiKey: "AIzaSyBF-Fguz14U12YzrrhiYPKVN89LR6Q1frk",
    authDomain: "colpromarket.firebaseapp.com",
    projectId: "colpromarket",
    storageBucket: "colpromarket.firebasestorage.app",
    messagingSenderId: "250114194708",
    appId: "1:250114194708:web:59bfedde2587a73acc5601",
    measurementId: "G-MW1YV1PEQ3"
  };

  const firebaseApp = initializeApp(firebaseConfig); 
const firebaseAuth = getAuth(firebaseApp);


const pinia = createPinia()

pinia.use(piniaPluginPersistedState)

const app = createApp(App)  
app.use(pinia)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  }, 
})

app.use(router)
app.provide('firebaseApp', firebaseApp);
app.provide('firebaseAuth', firebaseAuth);

app.mount('#app') 

export { firebaseAuth };  
