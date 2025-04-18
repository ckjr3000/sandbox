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
  data() {
    return {
      minValue: 0 as number,
      maxValue: 0 as number,
      stepValue: 0 as number,
      value: 0 as number,
    };
  },
  mounted() {
    switch (this.effect.name) {
      case "pan":
        this.minValue = -1;
        this.maxValue = 1;
        this.stepValue = 0.01;
        this.value = 0;
        break;
      case "q":
        this.minValue = 0;
        this.maxValue = 100;
        this.stepValue = 0.01;
        this.value = 1;
        break;
      case "delay":
        this.minValue = 0;
        this.maxValue = 1;
        this.stepValue = 0.01;
        this.value = 0.5;
        break;
      case "lowpass":
      case "highpass":
        this.minValue = 20;
        this.maxValue = 20000;
        this.stepValue = 1;
        this.value = 1000;
        break;
    }
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
