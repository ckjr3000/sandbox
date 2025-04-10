<!-- 
 Select component for choosing an effect to add to a sound source. 

 Each effect can only be added once to it is removed from the options on select and the
 sub component for that effect is mounted.

 Selection is emitted to the parent component, which will then mount the appropite effect control component.
-->

<template>
  <label for="add-effect">Add effect</label>
  <select name="add-effect" @change="handleAddEffect">
    <option value="default" selected>-</option>
    <option v-for="(effect, i) in effectTypes" :key="i" :value="effect">
      {{ effect }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EffectSelectVue",
  props: {
    availableEffects: {
      type: Array as () => string[],
      required: true,
    },
  },
  data() {
    return {
      effectTypes: this.availableEffects,
      activeEffects: [] as string[],
      valueRangeEffects: ["pan", "q", "delay", "filter"],
      valueSelectEffects: ["waveshape"],
    };
  },
  methods: {
    handleAddEffect(e: Event) {
      const selectedEffect = (e.target as HTMLSelectElement).value;

      // remove the selected effect from the list of available effects
      this.effectTypes = this.effectTypes.filter(
        (effect) => effect !== selectedEffect
      );

      // add the selected effect to the list of active effects
      this.activeEffects.push(selectedEffect);

      // set the selected effect to default
      (e.target as HTMLSelectElement).value = "default";

      // emit the selected effect to the parent component
      this.$emit("select-effect", this.activeEffects);
    },
  },
});
</script>

<style></style>
