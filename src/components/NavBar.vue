<template>
  <div class="container m-auto">
    <b-navbar>
      <template #brand>
        <b-navbar-item
            :to="{ name: 'home' }"
            tag="router-link"
        >
          PTCS
        </b-navbar-item>
      </template>
      <template
          v-if="$store.state.LOGGED_IN"
          #start
      >
        <b-navbar-item>
          <park-search />
        </b-navbar-item>
      </template>
      <template
          v-if="$store.state.LOGGED_IN"
          #end
      >
        <b-navbar-item v-if="$route.name !== 'park-editor'">
          <router-link :to="{name: 'park-editor'}" tag="button" class="button is-primary">
            <b-icon icon="plus" class="mr-2" />
            <span>Add park</span>
          </router-link>
        </b-navbar-item>
        <b-navbar-dropdown>
          <template #label>
            <div class="is-flex is-align-items-center">
              {{ user.name || user.firstName }}
            </div>
          </template>
          <b-navbar-item @click="logOut">
            Log Out
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template
          v-else
          #end
      >
        <b-navbar-item tag="div">
          <div class="buttons">
            <router-link
                v-if="$route.name !== 'sign-up'"
                :to="{ name: 'sign-up' }"
                class="button is-primary"
            >
              <strong>Sign up</strong>
            </router-link>
            <router-link
                v-if="$route.name !== 'log-in'"
                :to="{ name: 'log-in' }"
                class="button is-light"
            >
              Log in
            </router-link>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {StateType} from '@/store/types';
import firebase from 'firebase';
import ParkSearch from '@/components/utility/ParkSearch.vue';
@Component({
  components: {ParkSearch},
})
export default class NavBar extends Vue {

  get user() {
    return this.$store.state[StateType.USER];
  }

  public logOut() {
    firebase.auth().signOut();
  }
}
</script>
