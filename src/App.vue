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
  <section
    id="global-controls"
    v-if="oscillators.length > 0 || noiseSources.length > 0"
  >
    <button v-if="!allMuted" @click="handleMuteAll">Mute all</button>
    <button v-if="allMuted" @click="handleUnmuteAll">Unmute all</button>
  </section>
  <section id="sound-sources">
    <!-- noise sources -->
    <div class="sound-sources-group">
      <Noise
        v-for="(noiseSource, i) in noiseSources"
        :key="i"
        ref="noiseSourceRefs"
        :audioContext="audioContext"
        :activeNoiseSource="noiseSource"
        @noise-removed="handleRemoveNoise"
        @update-muted="handleUpdateNoiseMute"
        @update-gain="handleUpdateNoiseGain"
      />
    </div>

    <!-- low oscillators -->
    <div class="sound-sources-group">
      <Oscillator
        v-for="(oscillator, i) in lowOscillators"
        :key="i"
        ref="oscillatorRefs"
        :audioContext="audioContext"
        :oscType="oscillator.type"
        :activeOsc="oscillator"
        @osc-removed="handleRemoveOsc"
        @update-muted="handleUpdateOscMute"
        @update-gain="handleUpdateOscGain"
      />
    </div>

    <!-- mid oscillators -->
    <div class="sound-sources-group">
      <Oscillator
        v-for="(oscillator, i) in midOscillators"
        :key="i"
        ref="oscillatorRefs"
        :audioContext="audioContext"
        :oscType="oscillator.type"
        :activeOsc="oscillator"
        @osc-removed="handleRemoveOsc"
        @update-muted="handleUpdateOscMute"
        @update-gain="handleUpdateOscGain"
      />
    </div>

    <!-- high oscillators -->
    <div class="sound-sources-group">
      <Oscillator
        v-for="(oscillator, i) in highOscillators"
        :key="i"
        ref="oscillatorRefs"
        :audioContext="audioContext"
        :oscType="oscillator.type"
        :activeOsc="oscillator"
        @osc-removed="handleRemoveOsc"
        @update-muted="handleUpdateOscMute"
        @update-gain="handleUpdateOscGain"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Noise from "./components/sound-sources/NoiseVue.vue";
import Oscillator from "./components/sound-sources/OscillatorVue.vue";
import * as control from "@/utils/controlUtils";
import * as audio from "@/utils/audioUtils";
import { OscInstance, NoiseInstance } from "./types";
import { defineComponent } from "vue";

export default defineComponent({
  components: { Oscillator, Noise },
  data() {
    return {
      audioContext: new AudioContext() as AudioContext,
      soundSrcTypes: ["Osc - low", "Osc - mid", "Osc - high", "Noise"],
      oscId: 0,
      noiseId: 0,
      oscillators: [] as OscInstance[],
      noiseSources: [] as NoiseInstance[],
      allMuted: true,
    };
  },
  computed: {
    lowOscillators(): OscInstance[] {
      return this.oscillators.filter((osc) => osc.type === "Osc - low");
    },
    midOscillators(): OscInstance[] {
      return this.oscillators.filter((osc) => osc.type === "Osc - mid");
    },
    highOscillators(): OscInstance[] {
      return this.oscillators.filter((osc) => osc.type === "Osc - high");
    },
  },
  methods: {
    handleAddSoundSrc(src: string) {
      if (["Osc - low", "Osc - mid", "Osc - high"].includes(src)) {
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        this.oscId++;
        const oscInstance: OscInstance = {
          id: this.oscId,
          type: src,
          osc,
          gainNode,
          isMuted: true,
          gain: 0.2,
        };

        this.oscillators.push(oscInstance);
      } else if (src === "Noise") {
        const ctx = this.audioContext;
        const noiseSource = audio.createWhiteNoiseSource(ctx);
        const gainNode = this.audioContext.createGain();

        this.noiseId++;
        const noiseInstance: NoiseInstance = {
          id: this.noiseId,
          noiseSource,
          gainNode,
          isMuted: true,
          gain: 0.2,
        };
        this.noiseSources.push(noiseInstance);
      }
    },
    handleRemoveOsc(oscId: number) {
      let i = this.oscillators.map((osc) => osc.id).indexOf(oscId);
      this.oscillators.splice(i, 1);
    },
    handleRemoveNoise(noiseId: number) {
      let i = this.noiseSources.map((src) => src.id).indexOf(noiseId);
      this.noiseSources.splice(i, 1);
    },
    handleUpdateOscMute(id: number, isMuted: boolean) {
      const osc = this.oscillators.find((o) => o.id === id);
      if (osc) osc.isMuted = isMuted;
      this.checkIfAllMuted();
    },
    handleUpdateNoiseMute(id: number, isMuted: boolean) {
      const noise = this.noiseSources.find((n) => n.id === id);
      if (noise) noise.isMuted = isMuted;
      this.checkIfAllMuted();
    },
    checkIfAllMuted() {
      const allMuted =
        this.oscillators.every((osc) => osc.isMuted) &&
        this.noiseSources.every((src) => src.isMuted);
      this.updateMutedState(allMuted);
    },
    updateMutedState(state: boolean) {
      this.allMuted = state;
    },
    handleMuteAll() {
      // Mute all oscillators
      if (this.oscillators.length > 0) {
        for (let i = 0; i < this.oscillators.length; i++) {
          const osc = this.oscillators[i];
          control.changeGain(this.audioContext, 0, false, osc.gainNode);
          osc.isMuted = true;
        }
      }
      if (this.noiseSources.length > 0) {
        for (let i = 0; i < this.noiseSources.length; i++) {
          const src = this.noiseSources[i];
          control.changeGain(
            this.audioContext,
            0,
            false,
            this.noiseSources[i].gainNode
          );
          src.isMuted = true;
        }
      }
      this.allMuted = true;
    },
    handleUnmuteAll() {
      if (this.oscillators.length > 0) {
        for (let i = 0; i < this.oscillators.length; i++) {
          const osc = this.oscillators[i];
          control.changeGain(this.audioContext, osc.gain, false, osc.gainNode);
          osc.isMuted = false;
        }
      }
      if (this.noiseSources.length > 0) {
        for (let i = 0; i < this.noiseSources.length; i++) {
          const src = this.noiseSources[i];
          control.changeGain(this.audioContext, src.gain, false, src.gainNode);
          src.isMuted = false;
        }
      }
      this.allMuted = false;
    },
    handleUpdateOscGain(id: number, gain: number) {
      const osc = this.oscillators.find((o) => o.id === id);
      if (osc) osc.gain = gain;
    },
    handleUpdateNoiseGain(id: number, gain: number) {
      const noise = this.noiseSources.find((n) => n.id === id);
      if (noise) noise.gain = gain;
    },
  },
});
</script>

<style>
.sound-sources-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.sound-source-component {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
</style>
