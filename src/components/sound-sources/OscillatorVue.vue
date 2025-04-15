<!-- 
Component for an oscillator sound source.

Takes 'oscType' prop to determine the available frequency range.

By default has mute/unmute, gain control, and frequency control.
-->

<template>
  <h2>{{ oscType }}</h2>

  <button v-show="!muted" ref="muteBtn" @click.prevent="handleMute">
    Mute
  </button>
  <button v-show="muted" ref="unmuteBtn" @click.prevent="handleUnMute">
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
      value="0.2"
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
    <SingleRangeEffectControl
      v-if="effect.controlType === 'range'"
      :key="i"
      :effect="effect"
      :audioContext="audioContext"
      :effectNode="getEffectNode(effect.name)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OscInstance, Effect } from "@/types";
import * as control from "@/utils/controlUtils";
import * as effects from "@/utils/effectDefinitions";
import EffectSelect from "../effects/EffectSelectVue.vue";
import RangeEffectControl from "../effects/RangeEffectControlVue.vue";

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
      muted: true,
      oscillatorNode: this.activeOsc.osc,
      gainNode: this.activeOsc.gainNode,
      panNode: this.audioContext.createStereoPanner(),
      delayNode: this.audioContext.createDelay(),
      availableEffects: [effects.panEffect, effects.delayEffect] as Effect[],
      activeEffects: [] as Effect[],
    };
  },
  mounted() {
    const ctx = this.audioContext;

    this.oscillatorNode.frequency.setValueAtTime(
      parseFloat((this.$refs.freqCtrl as HTMLInputElement).value),
      ctx.currentTime
    );
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime);

    // Initialise and connect all available effects
    this.panNode.pan.setValueAtTime(0, ctx.currentTime);

    this.delayNode.delayTime.setValueAtTime(0, ctx.currentTime);

    this.oscillatorNode
      .connect(this.panNode)
      .connect(this.delayNode)
      .connect(this.gainNode)
      .connect(ctx.destination);

    // Start the oscillator
    this.oscillatorNode.start();
  },
  methods: {
    handleUnMute() {
      this.muted = false;
      control.changeGain(
        this.audioContext,
        parseFloat((this.$refs.gainCtrl as HTMLInputElement).value),
        this.muted,
        this.gainNode
      );
    },
    handleMute() {
      this.muted = true;
      control.mute(this.audioContext, this.gainNode);
    },
    handleGainChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        control.changeGain(
          this.audioContext,
          parseFloat(target.value),
          this.muted,
          this.gainNode
        );
      }
    },
    handleFreqChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        control.changeFreq(
          this.audioContext,
          parseFloat(target.value),
          this.oscillatorNode
        );
      }
    },
    handleEffectSelected(activeEffects: Effect[]) {
      this.activeEffects = [...activeEffects];
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
  },
});
</script>
