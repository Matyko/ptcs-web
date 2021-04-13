import firebase from 'firebase';
import {db} from '@/firebase';
import {User} from '@/types';
import {mapMutations} from 'vuex';
import {MutationType} from '@/store/types';

export const googleLoginMixin = {
    data() {
        return {
            googleLoading: false,
        };
    },
    methods: {
        ...mapMutations({
            setUser: MutationType.SET_USER,
            setLoggedIn: MutationType.SET_LOGGED_IN,
        }),
        async loginWithGoogle() {
            // @ts-ignore
            this.googleLoading = true;
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const { user, additionalUserInfo } = await firebase.auth().signInWithPopup(provider);
                if (user) {
                    if (additionalUserInfo && additionalUserInfo.isNewUser) {
                        await db.collection('users').doc(user.uid).set({
                            email: user.email,
                            phone: user.phoneNumber,
                            name: user.displayName,
                            photoUrl: user.photoURL,
                        });
                    }
                    const doc = await db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        const loggedInUser = {...doc.data(), id: user.uid} as User;
                        this.setUser(loggedInUser);
                        this.setLoggedIn(true);
                    }
                }
            } catch (e) {
                // @ts-ignore
                this.$buefy.toast.open({
                    type: 'is-danger',
                    message: 'Something went wrong.',
                });
            }
            // @ts-ignore
            this.googleLoading = false;
        },
    },
};
