export function createBandPassFilter(
  ctx: AudioContext,
  centreFreq: number,
  bandwidth: number
): BiquadFilterNode {
  const bandPassFilter = ctx.createBiquadFilter();
  bandPassFilter.type = "bandpass";
  bandPassFilter.frequency.setValueAtTime(centreFreq, ctx.currentTime);
  bandPassFilter.Q.value = calculateQ(bandwidth);

  return bandPassFilter;
}

// https://stackoverflow.com/questions/15627013/how-do-i-configure-a-bandpass-filter
function calculateQ(bandwidth: number) {
  return Math.sqrt(Math.pow(2, bandwidth)) / (Math.pow(2, bandwidth) - 1);
}

export function adjustFilterValue(
  ctx: AudioContext,
  bandPassFilter: BiquadFilterNode,
  centreFreq: number,
  bandwidth: number
) {
  if (!bandPassFilter) return;

  bandPassFilter.frequency.linearRampToValueAtTime(
    centreFreq,
    ctx.currentTime + 0.05
  );
  bandPassFilter.Q.value = calculateQ(bandwidth);
}
