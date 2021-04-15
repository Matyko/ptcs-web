<template>
  <div class="button-with-dropdown">
    <BButton
        class="button-with-dropdown__main"
        v-bind="$attrs"
        v-on="$listeners"
        :disabled="disabled"
        :loading="loading"
        :outlined="outlined"
        :type="type"
    >
      <slot></slot>
    </BButton>
    <BDropdown :position="position">
      <template #trigger="{ active }">
        <BButton
            class="button-with-dropdown__dropdown-trigger"
            v-bind="$attrs"
            :disabled="disabled"
            icon-left="angle-down"
            :loading="loading"
            :outlined="outlined"
            :type="type"
        />
      </template>
      <slot name="dropdown"></slot>
    </BDropdown>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class ButtonWithDropdown extends Vue {
  @Prop({type: Boolean, default: () => false}) private readonly loading!: boolean;
  @Prop({type: Boolean, default: () => false}) private readonly disabled!: boolean;
  @Prop({type: Boolean, default: () => false}) private readonly outlined!: boolean;
  @Prop(String) private readonly type?: string;
  @Prop(String) private readonly position?: string;

}
</script>

<style lang="scss" scoped>
::v-deep {
  .button-with-dropdown {

    &__main {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: 2px !important;
    }

    &__dropdown-trigger {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      margin-left: 0;
    }
  }
}
</style>
