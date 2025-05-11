import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import {
    Avatar,
    Button, Calendar,
    Card, Column, DataTable, Dialog,
    Drawer,
    Dropdown,
    Image,
    InputText,
    Menu,
    Menubar,
    SelectButton,
    Toolbar,
    Tooltip
} from 'primevue'
import Aura from '@primeuix/themes/aura';
import i18n from "./i18n.js";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import router from "./router/index.js";

const app = createApp(App)
app
    .use(PrimeVue, { ripple: true, theme: { preset: Aura }})
    .component('pv-column', Column)
    .component('pv-button', Button)
    .component('pv-card',Card)
    .component('pv-select-button', SelectButton)
    .component('pv-drawer', Drawer)
    .component('pv-avatar', Avatar)
    .component('pv-menu', Menu)
    .component('pv-menubar', Menubar)
    .component('pv-input-text', InputText)
    .component('pv-toolbar', Toolbar)
    .component('pv-tooltip', Tooltip)
    .component('pv-image', Image)
    .component('pv-dropdown', Dropdown)
    .component('InputText', InputText)
    .component('pv-calendar', Calendar)
    .component('pv-table', DataTable)
    .component('pv-dialog', Dialog)
    .use(i18n)
    .use(router)
    .mount('#app')
