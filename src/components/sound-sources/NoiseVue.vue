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
  <label for="add-effect">Add effect</label>
  <select name="add-effect">
    <option v-for="(effect, i) in effectTypes" :key="i" :value="effect">
      {{ effect }}
    </option>
  </select>
</template>

<script>
import { mute, changeGain } from "@/utils/gainUtils.js";

export default {
  name: "NoiseVue",
  props: {
    audioContext: {
      type: Object,
      required: true,
    },
    activeNoiseSource: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      muted: true,
      noiseSource: this.activeNoiseSource.noiseSource,
      gainNode: this.activeNoiseSource.gainNode,
      effectTypes: ["pan", "q", "delay", "lowpass", "highpass", "bandpass"],
    };
  },
  mounted() {
    const ctx = this.audioContext;
    const noiseSource = this.activeNoiseSource.noiseSource;
    const gainNode = this.activeNoiseSource.gainNode;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    noiseSource.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    noiseSource.loop = true;
  },
  methods: {
    handleUnMute() {
      this.muted = false;
      changeGain(
        this.audioContext,
        parseFloat(this.$refs.gainCtrl.value),
        this.muted,
        this.gainNode
      );
    },
    handleMute() {
      this.muted = true;
      mute(this.audioContext, this.gainNode);
    },
    handleGainChange(e) {
      changeGain(this.audioContext, e.target.value, this.muted, this.gainNode);
    },
  },
};
</script>

<style></style>
