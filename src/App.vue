<template>
  <main id="app" class="min-h-100-screen is-flex is-flex-direction-column">
    <template v-if="$store.state.AUTH_READY">
      <NavBar />
      <div class="is-flex is-flex-grow-1">
        <MainMenu v-if="$store.state.LOGGED_IN" />
        <router-view class="is-flex-grow-1"/>
      </div>
    </template>
    <b-loading active v-else />
  </main>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import NavBar from '@/components/NavBar.vue';
import MainMenu from '@/components/MainMenu.vue';


@Component({
  components: {
    MainMenu,
    NavBar,
  },
})
export default class App extends Vue {}
</script>
