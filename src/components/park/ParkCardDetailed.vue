<template>
  <div class="card">
    <div class="card-image">
      <ParkCarousel :photos="park.photos" />
    </div>
    <div class="card-content">
      <BField horizontal label="Name">
        <p>{{ park.name }}</p>
      </BField>
      <BField horizontal label="Location">
        <div style="max-width: 600px; border-radius: 4px; overflow: hidden;" class="m-auto">
          <BImage ratio="6by3" responsive :src="mapImagePath"></BImage>
        </div>
      </BField>
      <BField horizontal label="Description">
        <p>{{ park.description }}</p>
      </BField>
      <div class="card-footer">
        <div class="card-footer-item">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Park} from '@/types';
import ParkCarousel from '@/components/park/ParkCarousel.vue';
@Component({
  components: {ParkCarousel},
})
export default class ParkCardDetailed extends Vue {
  @Prop(Object) private readonly park!: Park;

  get mapImagePath() {
    return `https://api.mapbox.com/styles/v1/matyikrista/cknfsgjt9448u17oc1ednqpxj/static/pin-s+00ccff(${this.park.geoLocation.lng},${this.park.geoLocation.lat})/${this.park.geoLocation.lng},${this.park.geoLocation.lat},16,0/600x300?access_token=${process.env.VUE_APP_MAPBOX_TOKEN}`;
  }
}
</script>

<style scoped>

</style>
