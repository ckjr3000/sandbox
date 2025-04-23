<!-- 
Component for any audio effect that uses a range input to set value.
-->

<template>
  <button @click="handleRemoveEffect">Remove</button>
  <label :for="`${effect.name}-ctrl`">{{ effect.name }}</label>
  <div v-for="param in effect.params" :key="param.name">
    <input
      type="range"
      :name="param.name"
      :ref="`${param.name}-ctrl`"
      :min="param.min"
      :max="param.max"
      :step="param.step"
      :value="param.value"
      @input="handleValueChange"
    />
    <button
      v-if="!showAutomationControls"
      @click="showAutomationControls = true"
    >
      Automate
    </button>
    <AutomateRangeEffectControl
      v-if="showAutomationControls"
      :audioContext="audioContext"
      :effectNode="effectNode"
      :inputAttributes="getInputAttributes(param.name)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as control from "@/utils/controlUtils";
import { Effect, RangeInputAttributes } from "@/types";
import AutomateRangeEffectControl from "./AutomateRangeEffectControlVue.vue";

export default defineComponent({
  components: { AutomateRangeEffectControl },
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
      showAutomationControls: false,
    };
  },
  methods: {
    getInputAttributes(paramName: string): RangeInputAttributes {
      /* 
        Because these input refs are created inside a v-for, vue will return this.refs
        as an array. However, because we know that paramName will be unique (because audio
        effects can only be added to a sound source once) we can safely assume access to
        the input at inputArray[0].
      */
      const inputArray = this.$refs[`${paramName}-ctrl`] as HTMLInputElement[];
      const input = inputArray[0];

      const attributeVals = {
        min: input.min,
        max: input.max,
        step: input.step,
        value: input.value,
      };
      return attributeVals;
    },
    handleValueChange(e: Event) {
      const target = e.target as HTMLInputElement;
      switch (target.name) {
        case "panValue":
          control.changePan(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as StereoPannerNode
          );
          break;
        case "delayTime":
          control.changeDelay(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as DelayNode
          );
          break;
        case "frequency":
          control.changeFilterFrequency(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as BiquadFilterNode
          );
          break;
        case "bpQ":
          control.changeFilterQ(
            this.audioContext,
            parseFloat(target.value),
            this.effectNode as BiquadFilterNode
          );
          break;
      }
    },
    handleRemoveEffect() {
      this.$emit("effectRemoved", this.effect);
    },
  },
});
</script>

<style></style>
