<template>
  <div
      class="is-relative has-background-light is-flex is-align-items-center is-justify-content-center mb-4"
      style="overflow: hidden; height: 250px;"
  >
    <div class="is-absolute w-100">
      <BCarousel
          v-if="photos && photos.length"
          :autoplay="false"
      >
        <BCarouselItem
            v-for="photo in photos"
            :key="photo.name"
        >
          <BImage
              :alt="photo.name"
              :src="photo.url"
              lazy
          ></BImage>
        </BCarouselItem>
      </BCarousel>
      <div v-else>
        <p class="has-text-centered">
          No photos yet...
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {ParkPhoto} from '../../types';

@Component
export default class ParkCarousel extends Vue {
  @Prop() private readonly photos!: ParkPhoto[];
}
</script>

<style scoped>

</style>
