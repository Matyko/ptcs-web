<template>
  <div class="p-4">
    <PendingParks :pending-parks="pendingParks" />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ParkSearch from '@/components/utility/ParkSearch.vue';
import {db} from '@/firebase';
import {StateType} from '@/store/types';
import {CollectionType, Park, ParkRequest} from '@/types';
import PendingParks from '@/components/home/PendingParks.vue';

@Component({
  components: {PendingParks, ParkSearch},
})
export default class MyParks extends Vue {
  private pendingParks: ParkRequest[] = [];

  created() {
    this.loadPendingParks();
  }

  public async loadPendingParks() {
    const docs = await db.collection(CollectionType.ParkRequests).where('park.contributors', 'array-contains', this.$store.state[StateType.USER].id).get();
    if (!docs.empty) {
      docs.forEach((snapshot) => {
        const parkRequest = snapshot.data() as ParkRequest;
        parkRequest.id = snapshot.id;
        this.pendingParks.push(parkRequest);
      });
    }
  }
}
</script>
