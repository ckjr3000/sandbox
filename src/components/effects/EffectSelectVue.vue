<!-- 
 Select component for choosing an effect to add to a sound source. 

 Each effect can only be added once to it is removed from the options on select and the
 sub component for that effect is mounted.
-->

<template>
  <label for="add-effect">Add effect</label>
  <select name="add-effect" @change="handleAddEffect">
    <option value="default" selected>-</option>
    <option
      v-for="(effect, i) in effectTypes"
      :key="i"
      :value="effect"
      @click="$emit('effect-selected', effect)"
    >
      {{ effect }}
    </option>
  </select>
  <div v-for="(effect, i) in activeEffects" :key="i">
    <ValueRangeEffect
      v-if="valueRangeEffects.includes(effect)"
      :effect="effect"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ValueRangeEffect from "./ValueRangeEffectVue.vue";

export default defineComponent({
  name: "EffectSelectVue",
  components: {
    ValueRangeEffect,
  },
  props: {
    availableEffects: {
      type: Array as () => string[],
      required: true,
    },
  },
  data() {
    return {
      effectTypes: [] as string[],
      activeEffects: [] as string[],
      valueRangeEffects: ["pan", "q", "delay", "filter"],
      valueSelectEffects: ["waveshape"],
    };
  },
  created() {
    this.effectTypes = [...this.availableEffects];
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
    },
  },
});
</script>

<style></style>
