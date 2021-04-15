<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <BInputWithValidator
        v-if="editing"
        v-model="newValue"
        placeholder="Name"
        rules="required|min:3"
        vid="name"
        @blur="handleSubmit(emitInput)"
    />
    <div
        v-else
        class="py-2 is-flex is-justify-content-space-between is-align-items-center"
        @click="startEdit"
    >
      <slot>
        <p>{{ value }}</p>
      </slot>
      <BIcon icon="edit" />
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import BInputWithValidator from '@/components/inputs/BInputWithValidator.vue';
import {ValidationObserver} from 'vee-validate';

@Component({
  components: {BInputWithValidator, ValidationObserver},
})
export default class ParkFormName extends Vue {
  @Prop(Object) private readonly value!: string;
  @Prop(Boolean) private readonly isEditing!: boolean;

  private newValue: string = '';
  private editing: boolean = true;

  @Watch('value', {immediate: true})
  onValueChange(val: string) {
    this.newValue = val;
  }

  @Watch('isEditing', {immediate: true})
  onEditChange(val: boolean) {
    this.editing = val;
  }

  public emitInput() {
    this.$emit('input', this.newValue);
    this.$emit('update:is-editing', false);
    this.editing = false;
  }

  public startEdit() {
    this.$emit('update:is-editing', true);
    this.editing = true;
  }
}
</script>

<style scoped>

</style>
