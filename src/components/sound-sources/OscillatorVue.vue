<!-- 
Component for an oscillator sound source.

Takes 'oscType' prop to determine the available frequency range.

By default has mute/unmute, gain control, and frequency control.
-->

<template>
  <div :class="['sound-source-component', oscTypeClass]">
    <h2>{{ oscType }}</h2>
    <button @click.prevent="handleRemove">Remove</button>
    <button
      v-show="!activeOsc.isMuted"
      ref="muteBtn"
      @click.prevent="handleMute"
    >
      Mute
    </button>
    <button
      v-show="activeOsc.isMuted"
      ref="unmuteBtn"
      @click.prevent="handleUnMute"
    >
      Unmute
    </button>
    <div class="gain">
      <label for="gain">Gain</label>
      <input
        name="gain"
        ref="gainCtrl"
        type="range"
        min="0"
        max="1"
        step="any"
        :value="activeOsc.gain"
        @input="handleGainChange"
      />
    </div>
    <div class="frequency">
      <label for="frequency">Frequency:</label>
      <input
        v-if="oscType === 'Osc - low'"
        name="frequency"
        ref="freqCtrl"
        type="range"
        min="45"
        max="120"
        step="0.01"
        @input="handleFreqChange"
      />
      <input
        v-if="oscType === 'Osc - mid'"
        name="frequency"
        ref="freqCtrl"
        type="range"
        min="121"
        max="1400"
        step="0.01"
        @input="handleFreqChange"
      />
      <input
        v-if="oscType === 'Osc - high'"
        name="frequency"
        ref="freqCtrl"
        type="range"
        min="1401"
        max="15000"
        step="0.01"
        @input="handleFreqChange"
      />
    </div>
    <EffectSelect
      :availableEffects="availableEffects"
      @select-effect="handleEffectSelected"
    />
    <div class="effect" v-for="(effect, i) in activeEffects" :key="effect.name">
      <RangeEffectControl
        v-if="effect.controlType === 'range'"
        :key="i"
        :effect="effect"
        :audioContext="audioContext"
        :effectNode="getEffectNode(effect.name)"
        @effect-removed="handleRemoveEffect"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OscInstance, Effect } from "@/types";
import * as control from "@/utils/controlUtils";
import * as effects from "@/utils/effectDefinitions";
import EffectSelect from "../controls/EffectSelectVue.vue";
import RangeEffectControl from "../controls/RangeEffectControlVue.vue";
export default defineComponent({
  name: "OscillatorVue",
  components: { EffectSelect, RangeEffectControl },
  props: {
    audioContext: {
      type: AudioContext,
      required: true,
    },
    oscType: {
      type: String,
      required: true,
    },
    activeOsc: {
      type: Object as () => OscInstance,
      required: true,
    },
  },
  data() {
    return {
      panNode: this.audioContext.createStereoPanner(),
      delayNode: this.audioContext.createDelay(),
      availableEffects: [effects.panEffect, effects.delayEffect] as Effect[],
      activeEffects: [] as Effect[],
    };
  },
  computed: {
    oscTypeClass(): string {
      switch (this.oscType) {
        case "Osc - low":
          return "bg-low";
        case "Osc - mid":
          return "bg-mid";
        case "Osc - high":
          return "bg-high";
        default:
          return "";
      }
    },
  },
  mounted() {
    const ctx = this.audioContext;

    this.activeOsc.osc.frequency.setValueAtTime(
      parseFloat((this.$refs.freqCtrl as HTMLInputElement).value),
      ctx.currentTime
    );
    this.activeOsc.gainNode.gain.setValueAtTime(0, ctx.currentTime);

    // Initialise and connect all available effects
    this.panNode.pan.setValueAtTime(0, ctx.currentTime);

    this.delayNode.delayTime.setValueAtTime(0, ctx.currentTime);

    this.activeOsc.osc
      .connect(this.panNode)
      .connect(this.delayNode)
      .connect(this.activeOsc.gainNode)
      .connect(ctx.destination);

    // Start the oscillator
    this.activeOsc.osc.start();
  },
  methods: {
    handleUnMute() {
      this.$emit("update-muted", this.activeOsc.id, false);
      control.changeGain(
        this.audioContext,
        parseFloat((this.$refs.gainCtrl as HTMLInputElement).value),
        false,
        this.activeOsc.gainNode
      );
    },
    handleMute() {
      this.$emit("update-muted", this.activeOsc.id, true);
      control.mute(this.audioContext, this.activeOsc.gainNode);
    },
    handleGainChange(e: Event) {
      const target = e.target as HTMLInputElement;
      const newGain = parseFloat(target.value);
      if (!isNaN(newGain)) {
        this.$emit("update-gain", this.activeOsc.id, newGain);
        control.changeGain(
          this.audioContext,
          newGain,
          this.activeOsc.isMuted,
          this.activeOsc.gainNode
        );
      }
    },
    handleFreqChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        control.changeFreq(
          this.audioContext,
          parseFloat(target.value),
          this.activeOsc.osc
        );
      }
    },
    handleEffectSelected(selectedEffect: Effect) {
      // add to active effects
      this.activeEffects.push(selectedEffect);

      // remove from available effects
      let i = this.availableEffects
        .map((effect) => effect.name)
        .indexOf(selectedEffect.name);
      this.availableEffects.splice(i, 1);
    },
    handleRemoveEffect(effectToRemove: Effect) {
      this.availableEffects.push(effectToRemove);

      let i = this.activeEffects
        .map((effect) => effect.name)
        .indexOf(effectToRemove.name);
      this.activeEffects.splice(i, 1);
    },
    getEffectNode(effect: string): AudioNode {
      switch (effect) {
        case "pan":
          return this.panNode;
        case "delay":
          return this.delayNode;
        default:
          throw new Error(`Invalid effect: ${effect}`);
      }
    },
    handleRemove() {
      // @TODO - proper garbage collection of leftover nodes after disconnecting
      this.activeOsc.gainNode.disconnect();

      // emit the id to the parent to remove from UI
      this.$emit("oscRemoved", this.activeOsc.id);
    },
  },
});
</script>

<style scoped>
.bg-low {
  background-color: rgb(192, 255, 195);
}

.bg-mid {
  background-color: rgb(192, 237, 255);
}

.bg-high {
  background-color: rgb(255, 249, 192);
}
</style>
