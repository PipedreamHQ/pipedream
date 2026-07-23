export const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "STOPPED",
]);

export const JOB_TIMEOUT_MS = 10 * 60 * 1000;
export const MAX_BUFFER_BYTES = 50 * 1024 * 1024;
export const RESULTS_RETRY_MS = 2 * 1000;
export const TRANSFER_TIMEOUT_MS = 2 * 60 * 1000;

export const buildStages = ({
  strategy,
  languages,
  enrichments,
  chunkingStrategy,
  maxCharacters,
  generateEmbeddings,
}) => {
  const stages = {};
  const partition = {};
  if (strategy) partition.strategy = strategy;
  if (languages?.length) partition.languages = languages;
  if (Object.keys(partition).length) stages.partition = partition;
  if (enrichments?.length) stages.enrich = {
    types: enrichments,
  };
  if (chunkingStrategy) stages.chunk = {
    strategy: chunkingStrategy,
    max_characters: maxCharacters || 800,
  };
  if (generateEmbeddings) stages.embed = {};
  return stages;
};

const formatByteLimit = (bytes) => bytes % (1024 * 1024) === 0
  ? `${bytes / (1024 * 1024)} MB`
  : `${bytes} bytes`;

export const assertWithinBufferLimit = (
  size,
  {
    label = "File",
    maxBytes = MAX_BUFFER_BYTES,
  } = {},
) => {
  if (size > maxBytes) {
    throw new Error(`${label} exceeds the ${formatByteLimit(maxBytes)} limit`);
  }
};

export const withTransferTimeout = async (
  operation,
  timeoutMs = TRANSFER_TIMEOUT_MS,
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await operation(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

export const streamToBuffer = async (
  stream,
  {
    label = "File",
    maxBytes = MAX_BUFFER_BYTES,
  } = {},
) => {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.from(chunk);
    totalBytes += buffer.length;
    assertWithinBufferLimit(totalBytes, {
      label,
      maxBytes,
    });
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
};
