import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import i18n from "@shared/i18n/i18n.js";
import router from "@shared/router/index.js"

const app = createApp(App);

app.use(router);
app.use(i18n);
app.mount('#app');
