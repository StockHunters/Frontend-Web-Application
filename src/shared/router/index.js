import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import {__appBase} from "@globals/app.config.js";

// const
const startupName = 'StockHunters';

// import layouts
import AuthLayout from "@shared/layouts/AuthLayout.vue";
import SessionLayout from "@shared/layouts/SessionLayout.vue";
import AppLayout from "@shared/layouts/AppLayout.vue";

// import views
import SignInView from "@/auth/views/SignInView.vue";
import SignUpView from "@/auth/views/SignUpView.vue";
import SessionView from "@/auth/views/SessionView.vue";

import ProductsView from "@/inventory/views/ProductsView.vue";
import ClientsView from "@/sales/views/ClientsView.vue";
import DashboardView from "@/dashboard/views/DashboardView.vue";
import SalesView from "@/sales/views/SalesView.vue";
import ReportsView from "@/reporting/views/ReportsView.vue";

// import NotFound
import NotFound from "@shared/components/notfound/NotFound.vue";

const routes = [
    {
        path: '/',
        name: 'root',
        redirect: '/auth/login',
    },
    {
        path: '/auth',
        name: 'auth',
        meta: {title: 'StockHunters | Auth' },
        component: AuthLayout,
        redirect: '/auth/login',
        children: [
            {
                path: 'login',
                name: 'auth.login',
                meta: {title: 'StockHunters | login'},
                component: SignInView,
            },
            {
                path: 'signup',
                name: 'auth.signup',
                meta: {title: 'StockHunters | signup'},
                component: SignUpView,
            }
        ]
    },
    {
        path:'/app',
        name: 'app',
        meta: {title: 'StockHunters | app', requiresAuth: false },
        component: AppLayout,
        children:[
            {
                path: '',
                name: 'app.dashboard',
                //meta: {title: 'StockHunters | dashboard', requiresAuth: true },
                //component: DashboardView,
                redirect: '/app/clients',
            },
            {
                path: 'clients',
                name: 'app.clients',
                meta: {title: 'StockHunters | clients', requiresAuth: false },
                component: ClientsView,
            },
            {
                path:'products',
                name:'app.products',
                meta: {title: 'StockHunters | products', requiresAuth: false },
                component: ProductsView
            },
            {
                path:'sales',
                name:'app.sales',
                meta: {title: 'StockHunters | sales', requiresAuth: false },
                component: SalesView
            },
            {
                path:'reports',
                name:'app.reports',
                meta: {title: 'StockHunters | reports', requiresAuth: false },
                component: ReportsView
            }
        ]
    },
    {
        path: '/session',
        name: 'session',
        meta: {title: 'StockHunters | session', requiresAuth: true },
        redirect: '/app',
        //component: SessionLayout,

        /*children: [
            {
                path: '',
                name: 'session.main',
                meta: { title: 'StockHunters | session', requiresAuth: true },
                component: SessionView,
            }
        ]*/
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
];

const router = createRouter({
    history: createWebHashHistory(__appBase),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth_token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'auth.login' });
    } else if (to.name === 'auth.login' && isAuthenticated) {
        next({ name: 'app.dashboard' });
    } else {
        next();
    }
});

router.afterEach((to) => {
    const title = to.meta.title || 'StockHunters';
    document.title = title;
})

export default router;