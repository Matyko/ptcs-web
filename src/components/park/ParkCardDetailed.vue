<template>
  <div class="card">
    <div class="card-content">
      <pre>
        {{ JSON.stringify(park, null, 2) }}
      </pre>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Park} from '@/types';

@Component
export default class ParkCardDetailed extends Vue {
  @Prop(Object) private readonly park!: Park;
}
</script>

<style scoped>

</style>
