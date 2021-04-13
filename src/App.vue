<template>
  <main id="app" class="min-h-100-screen">
    <template v-if="$store.state.AUTH_READY">
      <NavBar />
      <router-view/>
    </template>
    <b-loading active v-else />
  </main>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import NavBar from '@/components/NavBar.vue';


@Component({
  components: {
    NavBar,
  },
})
export default class App extends Vue {}
</script>
