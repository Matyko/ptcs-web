<template>
  <div class="container is-flex is-justify-content-center is-align-items-center w-100 min-h-80-screen m-auto">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(submit)">
        <div class="card">
          <header class="card-header has-background-primary">
            <p class="card-header-title has-text-white">
              Login
            </p>
          </header>
          <div class="card-content">
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
                Log in
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
                  :to="{ name: 'sign-up' }"
                  class="is-size-7 mb-4"
              >
                No account yet? Sign up!
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
import BInputWithValidator from '@/components/inputs/BInputWithValidator.vue';
import firebase from 'firebase';
import {googleLoginMixin} from '@/mixins';

@Component({
  mixins: [googleLoginMixin],
  components: {BInputWithValidator, ValidationObserver},
})
export default class LogIn extends Vue {
  private email: string = '';
  private password: string = '';
  private loading: boolean = false;

  public async submit() {
    if (!this.email || !this.password) {
      return;
    }
    this.loading = true;
    try {
      await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
    } catch (e) {
      if (e.code && e.code === 'auth/user-not-found') {
        this.$buefy.toast.open({
          type: 'is-warning',
          message: 'No user found with this email!',
        });
      } else if (e.code && e.code === 'auth/wrong-password') {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Invalid password. Please try again.',
        });
      } else {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Something went wrong, please check your credentials and try again.',
        });
      }
    }
    this.loading = false;
  }
}
</script>
