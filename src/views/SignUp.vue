<template>
  <div class="container is-flex is-justify-content-center is-align-items-center w-100 min-h-80-screen m-auto">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(submit)">
        <div class="card">
          <header class="card-header has-background-primary">
            <p class="card-header-title has-text-white">
              Sign up
            </p>
          </header>
          <div class="card-content">
            <div class="is-flex">
              <b-input-with-validator
                  v-model="firstName"
                  label="First Name"
                  name="first-name"
                  placeholder="First name"
                  rules="required"
                  vid="first-name"
              />
              <div style="width: 1rem;" />
              <b-input-with-validator
                  v-model="lastName"
                  label="Last Name"
                  name="last-name"
                  placeholder="Last name"
                  rules="required"
                  vid="last-name"
              />
            </div>
            <b-input-with-validator
                v-model="email"
                label="Email"
                name="email"
                placeholder="Email"
                rules="required|email"
                type="email"
                vid="email"
            />
            <b-input-with-validator
                v-model="password"
                label="Password"
                name="password"
                password-reveal
                placeholder="Password"
                rules="required|min:8"
                type="password"
                vid="password"
            />
            <b-input-with-validator
                v-model="confirmation"
                label="Confirm Password"
                name="password-confirm"
                password-reveal
                placeholder="Password"
                rules="required|confirmed:password"
                type="password"
                vid="password-confirm"
            />
          </div>
          <footer class="card-footer">
            <div class="card-footer-item is-flex-direction-column">
              <b-button
                  :disabled="loading"
                  :loading="loading"
                  class="px-6 mb-4"
                  expanded
                  native-type="submit"
                  type="is-primary"
                  @click="handleSubmit(submit)"
              >
                Sign up
              </b-button>
              <b-button
                  :loading="googleLoading"
                  class="px-6 mb-4"
                  expanded
                  icon-left="google"
                  icon-pack="fab"
                  outlined
                  type="is-primary"
                  @click="loginWithGoogle"
              >
                Log in using Google
              </b-button>
              <router-link
                  :to="{ name: 'log-in' }"
                  class="is-size-7 mb-4"
              >
                Already have an account? Log in here!
              </router-link>
            </div>
          </footer>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {ValidationObserver} from 'vee-validate';
import {googleLoginMixin} from '@/mixins';
import BInputWithValidator from '@/components/inputs/BInputWithValidator.vue';
import firebase from 'firebase';
import {db} from '@/firebase';
import {User} from '@/types';
import {MutationType} from '@/store/types';

@Component({
  mixins: [googleLoginMixin],
  components: {BInputWithValidator, ValidationObserver},
})
export default class SignUp extends Vue {
  private password: string = '';
  private firstName: string = '';
  private lastName: string = '';
  private confirmation: string = '';
  private email: string = '';
  private loading: boolean = false;

  public async submit() {
    if (!this.password || !this.email) {
      return;
    }
    this.loading = true;
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
      const {user} = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      if (user) {
        await db.collection('users').doc(user.uid).set({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
        });
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          const loggedInUser = doc.data() as User;
          this.$store.commit(MutationType.SET_USER, loggedInUser);
          this.$store.commit(MutationType.SET_LOGGED_IN, true);
        }
      }
    } catch (e) {
      this.$buefy.toast.open({
        type: 'is-danger',
        message: 'Something went wrong.',
      });
    }
    this.loading = false;
  }
}
</script>
