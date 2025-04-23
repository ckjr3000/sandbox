<!--
    Component mounted with a range input, used to automate the selection of values on that element
-->

<template>
  <h3>Automate</h3>
  <label for="min">min</label>
  <input
    id="min"
    ref="min"
    type="range"
    :min="inputAttributes.min"
    :max="inputAttributes.max"
    :step="inputAttributes.step"
    :value="inputAttributes.min"
  />
  <label for="max">max</label>
  <input
    id="max"
    ref="max"
    type="range"
    :min="inputAttributes.min"
    :max="inputAttributes.max"
    :step="inputAttributes.step"
    :value="inputAttributes.max"
  />
  <label for="speed">speed (ms)</label>
  <input id="speed" ref="speed" type="number" />
  <label for="type">type</label>
  <select name="type" id="type" ref="type">
    <option value="random">random</option>
  </select>
  <button v-if="!isAutomating" @click="automateValues">Go</button>
  <button v-if="isAutomating" @click="automateValues">Stop</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { AutomationValues, RangeInputAttributes } from "@/types";
import * as control from "@/utils/controlUtils";

export default defineComponent({
  props: {
    inputAttributes: {
      type: Object as () => RangeInputAttributes,
      required: true,
    },
    // value setter callback function to update the input being automated in the UI
    updateRangeInput: {
      type: Function as PropType<(value: number) => void>,
      required: true,
    },
  },
  data() {
    return {
      isAutomating: false,
      intervalId: null as number | null,
    };
  },
  methods: {
    automateValues() {
      if (this.isAutomating && this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isAutomating = false;
      } else {
        const automationType = (this.$refs.type as HTMLSelectElement).value;
        const automationValues: AutomationValues = {
          min: (this.$refs.min as HTMLInputElement).value,
          max: (this.$refs.max as HTMLInputElement).value,
          speed: (this.$refs.speed as HTMLInputElement).value,
        };

        switch (automationType) {
          case "random":
            this.intervalId = control.randomJump(
              this.updateRangeInput,
              automationValues
            );
            break;
        }

        this.isAutomating = true;
      }
    },
  },
});
</script>

<style></style>
