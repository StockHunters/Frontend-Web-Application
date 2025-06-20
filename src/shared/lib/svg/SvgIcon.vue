<script>
import { SvgLibrary } from "@shared/lib/svg/icons/index.js";

export default {
  name: 'SvgIcon',

  props: {
    name: { type: String, required: true },
    variant: { type: String, default: 'default' },
    customClass: { type: String, default: '' }
  },

  computed: {
    svg() {
      return SvgLibrary[this.name] || '';
    },
    svgClass() {
      return [`svg-variant-${this.variant}`, this.customClass].join(' ').trim();
    }
  }
};
</script>

<template>
  <span
      v-if="svg"
      :class="svgClass"
      v-html="svg"
      aria-hidden="true"
      :aria-label="`icon `+ name "
  />
</template>

<style scoped>
span{
  margin: 0;
  padding: 0;
}
</style>