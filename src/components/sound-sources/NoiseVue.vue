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
    :availableEffects="['pan', 'q', 'delay', 'lowpass', 'highpass', 'bandpass']"
  />
</template>

<script lang="ts">
import { mute, changeGain } from "@/utils/gainUtils";
import EffectSelect from "../effects/EffectSelectVue.vue";
import { NoiseInstance } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NoiseVue",
  components: {
    EffectSelect,
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
      panNode: null as StereoPannerNode | null,
      delayNode: null as DelayNode | null,
      lowPassNode: null as BiquadFilterNode | null,
      highPassNode: null as BiquadFilterNode | null,
      bandPassNode: null as BiquadFilterNode | null,
    };
  },
  mounted() {
    const ctx = this.audioContext;
    const noiseSource = this.activeNoiseSource.noiseSource;
    const gainNode = this.activeNoiseSource.gainNode;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    // Initialise and connect all available effects
    this.panNode = ctx.createStereoPanner();
    this.panNode.pan.setValueAtTime(0, ctx.currentTime);

    this.delayNode = ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0, ctx.currentTime);

    this.lowPassNode = ctx.createBiquadFilter();
    this.lowPassNode.type = "lowpass";
    /* frequencies below this value will be passed, so is initialised to 
    the highest available frequency */
    this.lowPassNode.frequency.setValueAtTime(15000, ctx.currentTime);

    this.highPassNode = ctx.createBiquadFilter();
    this.highPassNode.type = "highpass";
    /* frequencies above this value will be passed, so is initialised to
    the lowest available frequency */
    this.highPassNode.frequency.setValueAtTime(20, ctx.currentTime);

    this.bandPassNode = ctx.createBiquadFilter();
    this.bandPassNode.type = "bandpass";
    /* frequencies refers to the middle frequency of the bandpass filter,
    so is initialised to the middle of the available range. The Q is initalised 
    to 0 to give the widest possible bandwidth */
    this.bandPassNode.frequency.setValueAtTime(
      1000, // @TODO - write a method to calculate the middle of the available range
      ctx.currentTime
    );
    this.bandPassNode.Q.setValueAtTime(0, ctx.currentTime);

    //@TODO: explore other filters available on BiquadFilterNode

    noiseSource
      .connect(this.panNode)
      .connect(this.delayNode)
      .connect(gainNode)
      .connect(ctx.destination);

    noiseSource.start();
    noiseSource.loop = true;
  },
  methods: {
    handleUnMute() {
      this.muted = false;
      changeGain(
        this.audioContext,
        parseFloat((this.$refs.gainCtrl as HTMLInputElement).value),
        this.muted,
        this.gainNode
      );
    },
    handleMute() {
      this.muted = true;
      mute(this.audioContext, this.gainNode);
    },
    handleGainChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        changeGain(
          this.audioContext,
          parseFloat(target.value),
          this.muted,
          this.gainNode
        );
      }
    },
  },
});
</script>

<style></style>
