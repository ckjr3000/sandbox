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
  <label for="add-effect">Add effect</label>
  <select name="add-effect">
    <option v-for="(effect, i) in effectTypes" :key="i" :value="effect">
      {{ effect }}
    </option>
  </select>
</template>

<script>
import { mute, changeGain } from "@/utils/gainUtils.js";
import { changeFreq } from "@/utils/oscillatorUtils.js";

export default {
  name: "OscillatorVue",
  props: {
    audioContext: {
      type: Object,
      required: true,
    },
    oscType: {
      type: String,
      required: true,
    },
    activeOsc: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      muted: true,
      oscillatorNode: this.activeOsc.osc,
      gainNode: this.activeOsc.gainNode,
      effectTypes: ["pan", "q", "delay"],
    };
  },
  mounted() {
    const ctx = this.audioContext;
    const osc = this.oscillatorNode;
    const gainNode = this.gainNode;

    osc.frequency.setValueAtTime(
      parseFloat(this.$refs.freqCtrl.value),
      ctx.currentTime
    );
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    osc.connect(gainNode).connect(ctx.destination);
    osc.start();
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
    handleFreqChange(e) {
      changeFreq(this.audioContext, e.target.value, this.oscillatorNode);
    },
  },
};
</script>
