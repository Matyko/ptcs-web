import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
import LogIn from './views/LogIn.vue';
import store from '@/store/store';
import {StateType} from '@/store/types';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/sign-up',
            name: 'sign-up',
            component: SignUp,
        },
        {
            path: '/log-in',
            name: 'log-in',
            component: LogIn,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import(/* webpackChunkName: "contact" */ './views/Contact.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/park-editor/:id?',
            name: 'park-editor',
            component: () => import(/* webpackChunkName: "park-editor" */ './views/ParkEditor.vue'),
            props: true,
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state[StateType.LOGGED_IN]) {
        const hasAccount = localStorage.getItem('ptcs_loggedin');
        next({ name: hasAccount ? 'log-in' : 'sign-up'});
    } else {
        next();
    }
});

export default router;
