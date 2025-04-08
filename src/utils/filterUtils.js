export function createBandPassFilter(ctx, centreFreq, bandwidth) {
  const bandPassFilter = ctx.createBiquadFilter();
  bandPassFilter.type = "bandpass";
  bandPassFilter.frequency.setValueAtTime(
    parseFloat(centreFreq),
    ctx.currentTime
  );
  bandPassFilter.Q.value = calculateQ(parseFloat(bandwidth));

  return bandPassFilter;
}

// https://stackoverflow.com/questions/15627013/how-do-i-configure-a-bandpass-filter
function calculateQ(bandwidth) {
  return Math.sqrt(Math.pow(2, bandwidth)) / (Math.pow(2, bandwidth) - 1);
}

export function adjustFilterValue(ctx, bandPassFilter, centreFreq, bandwidth) {
  if (!bandPassFilter) return;

  bandPassFilter.frequency.linearRampToValueAtTime(
    parseFloat(centreFreq),
    ctx.currentTime + 0.05
  );
  bandPassFilter.Q.value = calculateQ(parseFloat(bandwidth));
}
