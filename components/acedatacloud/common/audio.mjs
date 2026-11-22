/** Read at most the published 25 MB transcription limit before submitting. */
export const readTranscriptionFile = async (stream, metadata = {}) => {
  const limit = 25 * 1024 * 1024;
  if (metadata.size > limit) { stream.destroy(); throw new Error("Audio file exceeds 25 MB."); }
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk)
      ? chunk
      : Buffer.from(chunk);
    size += buffer.length;
    if (size > limit) throw new Error("Audio file exceeds 25 MB.");
    chunks.push(buffer);
  }
  if (!size) throw new Error("Audio file is empty.");
  return Buffer.concat(chunks, size);
};
