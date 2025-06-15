<!-- 
Component for a white noise sound source.
-->

<template>
  <div class="sound-source-component">
    <h2>Noise</h2>
    <button @click="handleRemove">Remove</button>
    <button
      v-show="!activeNoiseSource.isMuted"
      ref="muteBtn"
      @click="handleMute"
    >
      Mute
    </button>
    <button
      v-show="activeNoiseSource.isMuted"
      ref="unmuteBtn"
      @click="handleUnMute"
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
import * as control from "@/utils/controlUtils";
import * as effects from "@/utils/effectDefinitions";
import EffectSelect from "../controls/EffectSelectVue.vue";
import RangeEffectControl from "../controls/RangeEffectControlVue.vue";
import { NoiseInstance, Effect } from "@/types";
import { defineComponent } from "vue";
import { getCentreFrequency } from "@/utils/audioUtils";

export default defineComponent({
  name: "NoiseVue",
  components: {
    EffectSelect,
    RangeEffectControl,
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
      availableEffects: [
        effects.panEffect,
        effects.delayEffect,
        effects.lowpassEffect,
        effects.highpassEffect,
        effects.bandpassEffect,
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
      this.$emit("update-muted", this.activeNoiseSource.id, false);
      control.changeGain(
        this.audioContext,
        parseFloat((this.$refs.gainCtrl as HTMLInputElement).value),
        false,
        this.activeNoiseSource.gainNode
      );
    },
    handleMute() {
      this.$emit("update-muted", this.activeNoiseSource.id, true);
      control.mute(this.audioContext, this.activeNoiseSource.gainNode);
    },
    handleGainChange(e: Event) {
      const target = e.target as HTMLInputElement;
      const newGain = parseFloat(target.value);
      if (!isNaN(newGain)) {
        this.$emit("update-gain", this.activeNoiseSource.id, newGain);
        control.changeGain(
          this.audioContext,
          newGain,
          this.activeNoiseSource.isMuted,
          this.activeNoiseSource.gainNode
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
    handleRemove() {
      // @TODO - garbage collection here
      this.activeNoiseSource.gainNode.disconnect();

      // emit the id to the parent to remove from UI
      this.$emit("noiseRemoved", this.activeNoiseSource.id);
    },
  },
});
</script>

<style scoped>
.sound-source-component {
  background-color: pink;
}
</style>
