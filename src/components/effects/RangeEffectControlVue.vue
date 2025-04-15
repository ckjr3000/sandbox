<!-- 
Component for any audio effect that uses a range input to set value.
-->

<template>
  <label :for="`${effect.name}-ctrl`">{{ effect.name }}</label>
  <input
    v-for="param in effect.params"
    :key="param.name"
    type="range"
    :name="`${effect.name}-ctrl`"
    :ref="`${effect.name}Ctrl`"
    :min="param.min"
    :max="param.max"
    :step="param.step"
    :value="param.value"
    @input="handleValueChange"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as control from "@/utils/controlUtils";
import { Effect } from "@/types";

export default defineComponent({
  props: {
    effect: {
      type: Object as () => Effect,
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
  },
  methods: {
    handleValueChange(e: Event) {
      const target = e.target as HTMLInputElement;
      switch (this.effect.name) {
        case "pan":
          control.changePan(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as StereoPannerNode
          );
          break;
        case "delay":
          control.changeDelay(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as DelayNode
          );
          break;
        case "lowpass":
        case "highpass":
          control.changeFilterFrequency(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as BiquadFilterNode
          );
          break;
      }
    },
  },
});
</script>

<style></style>
