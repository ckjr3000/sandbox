<!-- 
Component for any audio effect that uses a range input to set value.
-->

<template>
  <label :for="`${effect}-ctrl`">{{ effect }}</label>
  <input
    type="range"
    :name="`${effect}-ctrl`"
    :ref="`${effect}Ctrl`"
    :min="minValue"
    :max="maxValue"
    :step="stepValue"
    :value="value"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    effect: {
      type: String,
      required: true,
    },
    AudioContext: {
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
    switch (this.effect) {
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
      case "bandpass":
        this.minValue = 20;
        this.maxValue = 20000;
        this.stepValue = 1;
        this.value = 1000;
        break;
    }
  },
  methods: {
    // handleValueChange(e: Event) {
    //   const target = e.target as HTMLInputElement;
    //   switch (this.effect) {
    //     case "pan":
    //       break;
    //     case "q":
    //       break;
    //     case "delay":
    //       break;
    //     case "lowpass":
    //       break;
    //     case "highpass":
    //       break;
    //   }
    // },
  },
});
</script>

<style></style>
