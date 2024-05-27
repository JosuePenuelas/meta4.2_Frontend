/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

//axios
import router from './router';
import axios from 'axios';

// Configura Axios para incluir el token JWT en cada solicitud
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
