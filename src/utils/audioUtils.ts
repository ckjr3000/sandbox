/*
    Populate audio buffer with random data to create white noise.
*/

export function createWhiteNoiseSource(
  ctx: AudioContext
): AudioBufferSourceNode {
  const buffer = ctx.createBuffer(2, ctx.sampleRate * 3, ctx.sampleRate);
  const channelDataLeft = buffer.getChannelData(0);
  const channelDataRight = buffer.getChannelData(1);
  for (let i = 0; i < buffer.length; i++) {
    channelDataLeft[i] = Math.random() * 2 - 1;
    channelDataRight[i] = Math.random() * 2 - 1;
  }
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = buffer;

  return bufferSource;
}

/*
    Return centre frequency of 2 given frequencies.
    https://www.learningaboutelectronics.com/Articles/Center-frequency-calculator.php
*/

export function getCentreFrequency(
  lowerFreq: number,
  higherFreq: number
): number {
  if (lowerFreq > higherFreq) {
    throw new Error("lowerFreq must be less than higherFreq");
  } else {
    const ratio = higherFreq / lowerFreq;
    if (ratio < 1.1) {
      // is a narrow band filter
      return (lowerFreq + higherFreq) / 2;
    } else {
      return Math.sqrt(lowerFreq * higherFreq);
    }
  }
}
