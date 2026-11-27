import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";

const MB = 1024 * 1024;

// The largest PDF each KovaPDF API route accepts. A larger file is refused
// before it is read into memory.
export const MAX_FILE_BYTES = {
  signRequest: 15 * MB,
  verify: 50 * MB,
};

/**
 * Reads a file (URL or /tmp path) and returns it as { name, contentBase64 }.
 * A file larger than maxBytes is refused before it is read into memory.
 * @param {string} file A file URL or a path in /tmp
 * @param {number} [maxBytes] The largest size accepted
 * @returns {Promise<{name: string, contentBase64: string}>}
 */
export async function getFileObject(file, maxBytes) {
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(file);
  if (maxBytes && metadata.size && metadata.size > maxBytes) {
    stream.destroy?.();
    throw new ConfigurationError(`The file is ${(metadata.size / MB).toFixed(1)} MB. This action accepts PDFs up to ${maxBytes / MB} MB.`);
  }
  const chunks = [];
  let total = 0;
  for await (const chunk of stream) {
    total += chunk.length;
    if (maxBytes && total > maxBytes) {
      stream.destroy?.();
      throw new ConfigurationError(`The file is larger than ${maxBytes / MB} MB. This action accepts PDFs up to ${maxBytes / MB} MB.`);
    }
    chunks.push(chunk);
  }
  return {
    name: metadata.name,
    contentBase64: Buffer.concat(chunks).toString("base64"),
  };
}
