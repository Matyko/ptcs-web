<template>
  <BNavbar style="box-shadow: 0 0 2px 0; position: sticky; top: 0;">
    <template #brand>
      <BNavbarItem
          :to="{ name: 'home' }"
          tag="RouterLink"
      >
        <span
            class="has-text-centered has-text-weight-bold has-text-primary is-hidden-touch"
            style="width: calc(250px - 2rem);"
        >
          PTCS LOGO
        </span>
        <span
            class="has-text-weight-bold has-text-primary is-hidden-desktop"
        >
          PTCS LOGO
        </span>
      </BNavbarItem>
    </template>
    <template
        v-if="$store.state.LOGGED_IN"
        #start
    >
      <BNavbarItem>
        <park-search />
      </BNavbarItem>
    </template>
    <template
        v-if="$store.state.LOGGED_IN"
        #end
    >
      <BNavbarItem
          v-if="$route.name !== 'park-editor'"
          :to="{name: 'park-editor'}"
          class="button is-primary is-rounded is-outlined m-2"
          tag="router-link"
      >
        <BIcon
            class="mr-2"
            icon="plus-circle"
        />
        <strong>Add park</strong>
      </BNavbarItem>
      <BNavbarItem
          :to="{name: 'home'}"
          class="button is-primary is-rounded m-2"
          disabled
          tag="router-link"
      >
        <BIcon
            class="mr-2"
            icon="calendar-plus"
        />
        <strong>Organise event</strong>
      </BNavbarItem>
      <BNavbarDropdown>
        <template #label>
          <div class="is-flex is-align-items-center">
            <figure
                v-if="user.photoUrl"
                class="image is-32x32 mr-2"
            >
              <img
                  :src="user.photoUrl"
                  class="is-rounded"
                  alt="Image of user"
              >
            </figure>
            <span class="has-text-weight-bold">
            {{ user.name || user.firstName }}
          </span>
          </div>
        </template>
        <BNavbarItem @click="logOut">
          Log Out
        </BNavbarItem>
      </BNavbarDropdown>
    </template>
    <template
        v-else
        #end
    >
      <BNavbarItem tag="div">
        <div class="buttons">
          <RouterLink
              v-if="$route.name !== 'sign-up'"
              :to="{ name: 'sign-up' }"
              class="button is-primary"
          >
            <strong>Sign up</strong>
          </RouterLink>
          <RouterLink
              v-if="$route.name !== 'log-in'"
              :to="{ name: 'log-in' }"
              class="button is-light"
          >
            Log in
          </RouterLink>
        </div>
      </BNavbarItem>
    </template>
  </BNavbar>
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
