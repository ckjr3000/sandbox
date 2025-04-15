<!-- 
Component for a white noise sound source.
-->

<template>
  <h2>Noise</h2>
  <button v-show="!muted" ref="muteBtn" @click="handleMute">Mute</button>
  <button v-show="muted" ref="unmuteBtn" @click="handleUnMute">Unmute</button>
  <div class="gain">
    <label for="gain">Gain</label>
    <input
      name="gain"
      ref="gainCtrl"
      type="range"
      min="0"
      max="0.5"
      step="any"
      value="0.1"
      @input="handleGainChange"
    />
  </div>
  <EffectSelect
    :availableEffects="availableEffects"
    @select-effect="handleEffectSelected"
  />
  <div class="effect" v-for="(effect, i) in activeEffects" :key="effect.name">
    <SingleRangeEffectControl
      v-if="effect.controlType === 'single-range'"
      :key="i"
      :effect="effect.name"
      :audioContext="audioContext"
      :effectNode="getEffectNode(effect.name)"
    />
  </div>
</template>

<script lang="ts">
import * as control from "@/utils/controlUtils";
import EffectSelect from "../effects/EffectSelectVue.vue";
import SingleRangeEffectControl from "../effects/SingleRangeEffectControlVue.vue";
import { NoiseInstance, Effect } from "@/types";
import { defineComponent } from "vue";
import { getCentreFrequency } from "@/utils/audioUtils";

export default defineComponent({
  name: "NoiseVue",
  components: {
    EffectSelect,
    SingleRangeEffectControl,
  },
  props: {
    audioContext: {
      type: AudioContext,
      required: true,
    },
    activeNoiseSource: {
      type: Object as () => NoiseInstance,
      required: true,
    },
  },
  data() {
    return {
      muted: true,
      noiseSource: this.activeNoiseSource.noiseSource,
      gainNode: this.activeNoiseSource.gainNode,
      availableEffects: [
        { name: "pan", controlType: "single-range" },
        { name: "delay", controlType: "single-range" },
        { name: "lowpass", controlType: "single-range" },
        { name: "highpass", controlType: "single-range" },
        { name: "bandpass", controlType: "dual-range" },
      ] as Effect[],
      panNode: this.audioContext.createStereoPanner(),
      delayNode: this.audioContext.createDelay(),
      lowPassNode: this.audioContext.createBiquadFilter(),
      highPassNode: this.audioContext.createBiquadFilter(),
      bandPassNode: this.audioContext.createBiquadFilter(),
      activeEffects: [] as Effect[],
    };
  },
  mounted() {
    const ctx = this.audioContext;
    const noiseSource = this.activeNoiseSource.noiseSource;
    const gainNode = this.activeNoiseSource.gainNode;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    // Initialise and connect all available effects
    this.panNode.pan.setValueAtTime(0, ctx.currentTime);

    this.delayNode.delayTime.setValueAtTime(0, ctx.currentTime);

    this.lowPassNode.type = "lowpass";
    /* frequencies below this value will be passed, so is initialised to 
    the highest available frequency */
    this.lowPassNode.frequency.setValueAtTime(15000, ctx.currentTime);

    this.highPassNode.type = "highpass";
    /* frequencies above this value will be passed, so is initialised to
    the lowest available frequency */
    this.highPassNode.frequency.setValueAtTime(20, ctx.currentTime);

    this.bandPassNode.type = "bandpass";
    /* frequency refers to the middle frequency of the bandpass filter,
    so is initialised to the middle of the available range. The Q is initalised 
    to 1 to give the widest possible bandwidth */
    this.bandPassNode.frequency.setValueAtTime(
      getCentreFrequency(10, 15000),
      ctx.currentTime
    );
    this.bandPassNode.Q.setValueAtTime(1, ctx.currentTime);

    //@TODO: explore other filters available on BiquadFilterNode

    noiseSource
      .connect(this.panNode)
      .connect(this.delayNode)
      .connect(this.lowPassNode)
      .connect(this.highPassNode)
      .connect(this.bandPassNode)
      .connect(gainNode)
      .connect(ctx.destination);

    noiseSource.start();
    noiseSource.loop = true;
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
    handleEffectSelected(activeEffects: Effect[]) {
      this.activeEffects = [...activeEffects];
    },
    getEffectNode(effect: string): AudioNode {
      switch (effect) {
        case "pan":
          return this.panNode;
        case "delay":
          return this.delayNode;
        case "lowpass":
          return this.lowPassNode;
        case "highpass":
          return this.highPassNode;
        case "bandpass":
          return this.bandPassNode;
        default:
          throw new Error(`Invalid effect: ${effect}`);
      }
    },
  },
});
</script>

<style></style>
