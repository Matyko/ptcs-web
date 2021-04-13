<template>
  <ValidationProvider
      v-slot="{ errors, valid }"
      :name="$attrs.name || $attrs.label"
      :rules="rules"
      :vid="vid"
  >
    <b-field
        v-bind="$attrs"
        :message="errors"
        :type="{ 'is-danger': errors[0], 'is-success': valid }"
    >
      <b-input
          v-model="innerValue"
          v-bind="$attrs"
      ></b-input>
    </b-field>
  </ValidationProvider>
</template>

<script>
import {ValidationProvider} from 'vee-validate';

export default {
  components: {
    ValidationProvider,
  },
  props: {
    vid: {
      type: String,
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: '',
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal);
    },
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
