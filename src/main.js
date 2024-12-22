import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/index.js'; // Import the router correctly
import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Pusher from 'pusher-js';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Vuetify setup
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';


const vuetify = createVuetify({
  components,
  directives,
});
const options = {
  position: 'bottom-center', // Change to desired position
  timeout: 3000, // Toast duration in milliseconds
  closeOnClick: true, // Close the toast when clicked
  pauseOnHover: true, // Pause the timer on hover
};

// Pusher setup
const pusher = new Pusher('1a9e1b88fcbdd25d7a99', {
  cluster: 'eu',
  encrypted: true,
  debug: true,
});

// Pinia setup
const pinia = createPinia();

// Create the app
createApp(App)
  .use(router) // Use router
  .use(vuetify) // Use Vuetify
  .use(VueAxios, axios) // Use VueAxios with axios
  .use(pinia) // Use Pinia store
  .use(Toast,options)
  .mount('#app');

export default pusher; // Export Pusher if needed elsewhere
