/**
 * Limit model selection to IDs that are published for GPT chat and listed by
 * the authenticated Models API. Catalog-only or media IDs cannot be submitted.
 * @param {Object} available - Authenticated API response.
 * @param {Object} published - Public catalog response.
 * @returns {Object[]} Eligible GPT chat records.
 */
export const publishedChatModels = (available, published) => {
  if (!Array.isArray(available?.data) || !Array.isArray(published?.data)) {
    throw new Error("Model discovery returned an invalid catalog. No chat request was submitted.");
  }
  const ids = new Set(available.data.map((model) => model.id));
  return published.data.filter((model) => model.type === "chat"
    && model.service_prefix === "acedatacloud-openai" && ids.has(model.id));
};

/**
 * Convert published chat models to native Pipedream select options.
 * @param {Object[]} models - Validated catalog intersection.
 * @returns {Object[]} Unique labels and IDs.
 */
export const chatModelOptions = (models) => [
  ...new Map(models.map((model) => [
    model.id,
    {
      label: model.label || model.id,
      value: model.id,
    },
  ])).values(),
];

/**
 * Preserve definite errors and avoid retrying an ambiguous metered request.
 * @param {Error} error - Transport or API error.
 * @returns {Error} Original definite error or a usage warning.
 */
export const chatCompletionError = (error) => {
  const status = error?.response?.status || error?.status;
  if (status >= 400 && status < 500 && status !== 408) return error;
  return new Error("Chat completion did not return a confirmed response. The request may have incurred usage. Inspect the original request history before retrying; this action does not retry or switch models.");
};
