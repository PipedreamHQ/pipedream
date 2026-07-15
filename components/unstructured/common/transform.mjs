export const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "STOPPED",
]);

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

export const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
};
