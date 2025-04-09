<!-- 
Top level component with menu to add sound sources.
The audio context is initialised here and passed to child components.
-->

<template>
  <section id="add-source-buttons">
    <label for="add-sound-source">Add sound source:</label>
    <button
      name="add-sound-source"
      v-for="(source, i) in soundSrcTypes"
      :key="i"
      @click="handleAddSoundSrc(source)"
    >
      {{ source }}
    </button>
  </section>
  <section id="sound-sources">
    <div class="sound-sources-group">
      <div
        class="sound-source-component"
        v-for="(oscillator, i) in oscillators"
        :key="i"
        v-show="!oscillator.hidden"
      >
        <button @click="handleHideOscillator(i)">Remove</button>
        <Oscillator
          ref="oscillatorRefs"
          :audioContext="audioContext"
          :oscType="oscillator.type"
          :activeOsc="oscillator"
        />
      </div>
    </div>
    <div class="sound-sources-group">
      <div
        class="sound-source-component"
        v-for="(noiseSource, i) in noiseSources"
        :key="i"
        v-show="!noiseSource.hidden"
      >
        <button @click="handleHideNoiseSource(i)">Remove</button>
        <Noise
          ref="noiseSourceRefs"
          :audioContext="audioContext"
          :activeNoiseSource="noiseSource"
        />
      </div>
    </div>
  </section>
</template>

<script>
import Noise from "./components/sound-sources/NoiseVue.vue";
import Oscillator from "./components/sound-sources/OscillatorVue.vue";
import { createGainNode } from "@/utils/gainUtils";
import { createOscillator } from "@/utils/oscillatorUtils";
import { createWhiteNoiseSource } from "@/utils/noiseUtils";
import { createPanner } from "@/utils/panUtils";

export default {
  components: { Oscillator, Noise },
  data() {
    return {
      audioContext: new AudioContext(),
      soundSrcTypes: ["Osc - low", "Osc - mid", "Osc - high", "Noise"],
      oscillators: [],
      noiseSources: [],
    };
  },
  methods: {
    handleAddSoundSrc(src) {
      if (["Osc - low", "Osc - mid", "Osc - high"].includes(src)) {
        const ctx = this.audioContext;
        const osc = createOscillator(ctx);
        const gainNode = createGainNode(ctx);
        const stereoPanner = createPanner(ctx);

        const oscInstance = {
          type: src,
          osc,
          gainNode,
          stereoPanner,
        };

        this.oscillators.push(oscInstance);
      } else if (src === "Noise") {
        const ctx = this.audioContext;
        const noiseSource = createWhiteNoiseSource(ctx);
        const gainNode = createGainNode(ctx);

        const noiseInstance = {
          noiseSource,
          gainNode,
        };
        this.noiseSources.push(noiseInstance);
      }
    },
    handleHideOscillator(i) {
      const oscComponent = this.$refs.oscillatorRefs[i];
      if (oscComponent) {
        oscComponent.handleMute();
      }
      this.oscillators[i].hidden = true;
    },
    handleHideNoiseSource(i) {
      const noiseComponent = this.$refs.noiseSourceRefs[i];
      console.log(noiseComponent);
      if (noiseComponent) {
        noiseComponent.handleMute();
      }
      this.noiseSources[i].hidden = true;
    },
  },
};
</script>

<style>
#sound-sources {
  display: flex;
  flex-direction: row;
  padding: 15px;
}

.sound-source-component {
  border: 1px solid black;
  border-radius: 20px;
  width: fit-content;
  padding: 15px;
}
</style>
