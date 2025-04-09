<!-- 
 Select component for choosing an effect to add to a sound source. 
 
 Each effect can only be added once to it is removed from the options on select and the
 sub component for that effect is mounted.
-->

<template>
  <label for="add-effect">Add effect</label>
  <select name="add-effect" @change="handleAddEffect">
    <option value="default" selected>-</option>
    <option v-for="(effect, i) in effectTypes" :key="i" :value="effect">
      {{ effect }}
    </option>
  </select>
  <p>{{ activeEffects }}</p>
</template>

<script>
export default {
  props: {
    availableEffects: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      effectTypes: this.availableEffects,
      activeEffects: [],
    };
  },
  methods: {
    handleAddEffect(event) {
      const selectedEffect = event.target.value;
      // remove the selected effect from the list of available effects
      this.effectTypes = this.effectTypes.filter(
        (effect) => effect !== selectedEffect
      );
      // add the selected effect to the list of active effects
      this.activeEffects.push(selectedEffect);
      // set the selected effect to default
      event.target.value = "default";
    },
  },
};
</script>

<style></style>
