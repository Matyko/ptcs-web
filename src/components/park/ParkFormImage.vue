<template>
  <figure class="image is-64x64 is-relative">
    <img
        v-if="upload.url"
        :alt="upload.name"
        :src="upload.url"
    >
    <div v-else>
      <p class="is-size-7 has-text-centered"> {{ upload.name }} </p>
      <p class="has-text-weight-bold"> {{ upload.progress }}% </p>
    </div>
    <a class="delete" @click="removeImage" />
  </figure>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class ParkFormImage extends Vue {
  @Prop(Object) upload!: {url: string, name: string, progress?: number};

  public removeImage() {
    this.$buefy.dialog.confirm({
      type: 'is-danger',
      message: 'Are you sure you want to <strong>delete</strong> this image?',
      hasIcon: true,
      confirmText: 'Delete',
      onConfirm: () => this.$emit('delete'),
    })
  }
}
</script>

<style scoped>
figure.image a.delete {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-50%, -50%);
  display: none;
}

figure.image:hover a.delete {
  display: block;
}
</style>
