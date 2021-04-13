<template>
  <div class="container m-auto">
    <div class="card">
      <div class="card-content">
        <p class="title is-6">
          Parks waiting for submission
        </p>
        <div class="is-flex">
          <div
              v-for="park in pendingParks"
              :key="park.id"
              class="card m-2 max-w-30"
          >
            <header class="card-image">
              <b-carousel v-if="park && park.photos && park.photos.length">
                <b-carousel-item v-for="(photo, index) in park.photos">
                  <figure class="image">
                    <img
                        :alt="`Image of ${park.name} ${index + 1}`"
                        :src="photo"
                    >
                  </figure>
                </b-carousel-item>
              </b-carousel>
            </header>
            <footer class="card-footer">
              <div class="card-footer-item">
                <router-link :to="{name: 'park-editor', params: {id: park.id}}">
                  <b-icon icon="edit" />
                  {{ park.name }}
                </router-link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ParkSearch from '@/components/utility/ParkSearch.vue';
import {db} from '@/firebase';
import {StateType} from '@/store/types';
import {Park} from '@/types';

@Component({
  components: {ParkSearch},
})
export default class Home extends Vue {
  private pendingParks: Park[] = [];

  created() {
    this.loadPendingParks();
  }

  public async loadPendingParks() {
    const docs = await db.collection('parks-pending').where('contributors', 'array-contains', this.$store.state[StateType.USER].id).get();
    if (!docs.empty) {
      docs.forEach((snapshot) => {
        const park = snapshot.data() as Park;
        park.id = snapshot.id;
        this.pendingParks.push(park);
      });
    }
  }
}
</script>
