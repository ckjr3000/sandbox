export function createWhiteNoiseSource(ctx) {
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
