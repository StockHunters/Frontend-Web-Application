import {createRouter, createWebHistory} from "vue-router";
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
        meta: {title: 'StockHunters | app', requiresAuth: true },
        component: AppLayout,
    },
    {
        path: '/session',
        name: 'session',
        component: SessionLayout,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
];

const router = createRouter({
    history: createWebHistory(__appBase),
    routes,
});

router.afterEach((to) => {
    const title = to.meta.title || 'StockHunters';
    document.title = title;
})

export default router;