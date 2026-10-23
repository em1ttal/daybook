import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Crear y montar la aplicación
createApp(App).use(router).mount('#app')
