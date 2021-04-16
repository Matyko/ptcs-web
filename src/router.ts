import Vue from 'vue';
import Router, {NavigationGuardNext, Route} from 'vue-router';
import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
import LogIn from './views/LogIn.vue';
import store from '@/store/store';
import {StateType} from '@/store/types';
import {PathNames} from '@/types';
import {initialAuth} from '@/firebase';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: PathNames.Home,
            component: Home,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/sign-up',
            name: PathNames.SignUp,
            component: SignUp,
        },
        {
            path: '/log-in',
            name: PathNames.Login,
            component: LogIn,
        },
        {
            path: '/about',
            name: PathNames.About,
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/contact',
            name: PathNames.Contact,
            component: () => import(/* webpackChunkName: "contact" */ './views/Contact.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/my-parks',
            name: PathNames.MyParks,
            component: () => import(/* webpackChunkName: "my-parks" */ './views/MyParks.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/events',
            name: PathNames.Events,
            component: () => import(/* webpackChunkName: "events" */ './views/Events.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/friends',
            name: PathNames.Friends,
            component: () => import(/* webpackChunkName: "friends" */ './views/Friends.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/groups',
            name: PathNames.Groups,
            component: () => import(/* webpackChunkName: "groups" */ './views/Groups.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/messages',
            name: PathNames.Messages,
            component: () => import(/* webpackChunkName: "messages" */ './views/Messages.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/settings',
            name: PathNames.Settings,
            component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/admin',
            name: PathNames.Admin,
            component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
            meta: {
                requiresAuth: true,
                requiresAdmin: true,
            },
        },
        {
            path: '/profile',
            name: PathNames.Profile,
            component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/park-editor/:id?',
            name: PathNames.ParkEditor,
            component: () => import(/* webpackChunkName: "park-editor" */ './views/ParkEditor.vue'),
            props: true,
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (!store.state[StateType.AUTH_READY]) {
        awaitAuthAndCheck(to, from, next);
    } else {
        checkAuth(to, from, next);
    }
});

const awaitAuthAndCheck = async (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
    const willRedirect = await initialAuth;
    if (!willRedirect) {
        checkAuth(to, from, next);
    }
};

const checkAuth = (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
    if (to.meta.requiresAuth && !store.state[StateType.LOGGED_IN]) {
        const hasAccount = localStorage.getItem('ptcs_loggedin');
        next({name: hasAccount ? PathNames.Login : PathNames.SignUp});
        // @ts-ignore
    } else if (to.meta.requiresAdmin && (!(store.state[StateType.USER] && store.state[StateType.USER].roles.admin))) {
        next({name: PathNames.Home });
    } else {
        next();
    }
};

export default router;
