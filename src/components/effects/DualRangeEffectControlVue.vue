<template>
  <p>{{ effect }}</p>
  <label :for="param1">{{ param1 }}</label>
  <input
    type="range"
    :name="param1"
    :ref="param1"
    :min="minValue"
    :max="maxValue"
    :step="stepValue"
    :value="value"
    @input="handleValueChange"
  />
</template>

<script lang="ts">
export default {
  props: {
    effect: {
      type: String,
      required: true,
    },
    audioContext: {
      type: Object as () => AudioContext,
      required: true,
    },
    effectNode: {
      type: Object as () => AudioNode,
      required: true,
    },
    params: {
      type: Array as () => string[],
      required: true,
    },
  },
};
</script>

<style></style>
