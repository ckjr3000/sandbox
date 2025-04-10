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
