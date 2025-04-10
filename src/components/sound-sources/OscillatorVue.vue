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
  <EffectSelect :availableEffects="['pan', 'delay']" />
</template>

<script lang="ts">
import { mute, changeGain } from "@/utils/gainUtils";
import { changeFreq } from "@/utils/oscillatorUtils";
import EffectSelect from "../effects/EffectSelectVue.vue";
import { OscInstance } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "OscillatorVue",
  components: { EffectSelect },
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
      panNode: null as StereoPannerNode | null,
      delayNode: null as DelayNode | null,
    };
  },
  mounted() {
    const ctx = this.audioContext;
    const osc = this.oscillatorNode;
    const gainNode = this.gainNode;

    osc.frequency.setValueAtTime(
      parseFloat((this.$refs.freqCtrl as HTMLInputElement).value),
      ctx.currentTime
    );
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    // Initialise and connect all available effects
    this.panNode = ctx.createStereoPanner();
    this.panNode.pan.setValueAtTime(0, ctx.currentTime);

    this.delayNode = ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0, ctx.currentTime);

    osc
      .connect(this.panNode)
      .connect(this.delayNode)
      .connect(gainNode)
      .connect(ctx.destination);

    // Start the oscillator
    osc.start();
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
    handleFreqChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        changeFreq(
          this.audioContext,
          parseFloat(target.value),
          this.oscillatorNode
        );
      }
    },
  },
});
</script>
