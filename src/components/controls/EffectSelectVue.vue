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
    <option
      v-for="(effect, i) in availableEffects"
      :key="i"
      :value="effect.name"
    >
      {{ effect.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Effect } from "@/types";

export default defineComponent({
  name: "EffectSelectVue",
  props: {
    availableEffects: {
      type: Array as () => Effect[],
      required: true,
    },
  },
  methods: {
    handleAddEffect(e: Event) {
      const selectedEffectName = (e.target as HTMLSelectElement).value;

      const effectToAdd = this.availableEffects.find(
        (effect) => effect.name === selectedEffectName
      );

      if (effectToAdd) {
        this.$emit("select-effect", effectToAdd);
      }

      (e.target as HTMLSelectElement).value = "default";
    },
  },
});
</script>

<style></style>
