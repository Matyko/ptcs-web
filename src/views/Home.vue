<template>
  <div class="p-4">
    <h2 class="title is-5">
      Parks
    </h2>
    <div class="is-flex is-flex-wrap-wrap">
      <ParkCard
          v-for="park in parks"
          :key="park.address"
          :park="park"
          class="w-20"
      >
        <p>{{ park.name }}</p>
      </ParkCard>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {db} from '@/firebase';
import {CollectionType, Park} from '@/types';
import ParkCard from '@/components/park/ParkCard.vue';

@Component({
  components: {ParkCard},
})
export default class Home extends Vue {
  private parks: Park[] = [];

  public created() {
    db
        .collection(CollectionType.Parks)
        .where('active', '==', true)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              this.parks.push({...change.doc.data(), id: change.doc.id} as Park);
            }
            if (change.type === 'modified') {
              const idx = this.parks.findIndex(e => e.id === change.doc.id);
              if (idx > -1) {
                this.parks.splice(idx, 1, {...change.doc.data(), id: change.doc.id} as Park)
              }
            }
            if (change.type === 'removed') {
              const idx = this.parks.findIndex(e => e.id === change.doc.id);
              if (idx > -1) {
                this.parks.splice(idx, 1)
              }
            }
          });
        });
  }
}
</script>
