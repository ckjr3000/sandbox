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
      >
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
      >
        <Noise
          ref="noiseSourceRefs"
          :audioContext="audioContext"
          :activeNoiseSource="noiseSource"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Noise from "./components/sound-sources/NoiseVue.vue";
import Oscillator from "./components/sound-sources/OscillatorVue.vue";
import * as audio from "@/utils/audioUtils";
import { OscInstance, NoiseInstance } from "./types";
import { defineComponent } from "vue";

export default defineComponent({
  components: { Oscillator, Noise },
  data() {
    return {
      audioContext: new AudioContext() as AudioContext,
      soundSrcTypes: ["Osc - low", "Osc - mid", "Osc - high", "Noise"],
      oscillators: [] as OscInstance[],
      noiseSources: [] as NoiseInstance[],
    };
  },
  methods: {
    handleAddSoundSrc(src: string) {
      if (["Osc - low", "Osc - mid", "Osc - high"].includes(src)) {
        const ctx = this.audioContext;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        const oscInstance = {
          type: src,
          osc: osc,
          gainNode: gainNode,
        };

        this.oscillators.push(oscInstance);
      } else if (src === "Noise") {
        const ctx = this.audioContext;
        const noiseSource = audio.createWhiteNoiseSource(ctx);
        const gainNode = this.audioContext.createGain();

        const noiseInstance: NoiseInstance = {
          noiseSource,
          gainNode,
        };
        this.noiseSources.push(noiseInstance);
      }
    },
  },
});
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
