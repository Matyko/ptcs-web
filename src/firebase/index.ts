import firebase from 'firebase';
import store from '@/store/store';
import {MutationType, StateType} from '@/store/types';
import {User} from '@/types';
import router from '@/router';

firebase.initializeApp(
    {
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_DOMAIN,
        databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VUE_APP_FIREBASE_API_ID,
        measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
    },
);

export const db = firebase.firestore();

export const storage = firebase.storage().ref();

export const initialAuth = new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user && !store.state[StateType.USER]) {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                const loggedInUser = {...doc.data(), id: user.uid, roles: {}} as User;
                const token = await user.getIdTokenResult(true);
                if (token.claims) {
                    if (token.claims.admin) {
                        loggedInUser.roles.admin = true;
                        loggedInUser.roles.moderator = true;
                    }
                    if (token.claims.moderator) {
                        loggedInUser.roles.admin = true;
                    }
                }
                Object.freeze(loggedInUser.roles);
                store.commit(MutationType.SET_USER, loggedInUser);
                store.commit(MutationType.SET_LOGGED_IN, true);
                const needRedirect = ['log-in', 'sign-up'].includes(router.currentRoute.name as string);
                resolve(needRedirect);
                if (needRedirect) {
                    await router.push({name: 'home'});
                }
            }
        } else {
            store.commit(MutationType.SET_USER, null);
            store.commit(MutationType.SET_LOGGED_IN, false);
            if (!['log-in', 'sign-up'].includes(router.currentRoute.name || '')) {
                await router.push({name: 'log-in'});
            }
        }
        store.commit(MutationType.SET_AUTH_READY, true);
    });
});

