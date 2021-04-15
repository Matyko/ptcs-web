<template>
  <div
      class="card m-2"
  >
    <header class="card-image">
      <BCarousel
          style="height: 150px; overflow: hidden;"
      >
        <BCarouselItem v-for="(photo, index) in (park.photos || [])">
          <figure class="image">
            <img
                :alt="`Image of ${park.name} ${index + 1}`"
                :src="photo.url"
            >
          </figure>
        </BCarouselItem>
      </BCarousel>
    </header>
    <footer class="card-footer">
      <div class="card-footer-item">
        <slot></slot>
      </div>
    </footer>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Park} from '@/types';

@Component
export default class ParkCard extends Vue {
  @Prop(Object) private readonly park!: Park;
}
</script>
