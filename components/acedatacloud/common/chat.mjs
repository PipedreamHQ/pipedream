/**
 * Limit model selection to IDs that are published for chat and listed by
 * the authenticated Models API. Catalog-only or media IDs cannot be submitted.
 * @param {Object} available - Authenticated API response.
 * @param {Object} published - Public catalog response.
 * @returns {Object[]} Eligible chat records, independent of model family.
 */
export const publishedChatModels = (available, published) => {
  if (!Array.isArray(available?.data) || !Array.isArray(published?.data)) {
    throw new Error("Model discovery returned an invalid catalog. No chat request was submitted.");
  }
  const ids = new Set(available.data.map((model) => model.id));
  return published.data.filter((model) => model.type === "chat" && ids.has(model.id));
};

const chatProtocols = [
  [
    "chat_completions",
    "/v1/chat/completions",
    "https://api.acedata.cloud/v1",
  ],
  [
    "messages",
    "/v1/messages",
    "https://api.acedata.cloud",
  ],
  [
    "responses",
    "/v1/responses",
    "https://api.acedata.cloud/v1",
  ],
];

/** Select only a published, known Ace protocol; metadata cannot retarget credentials. */
export const chatEndpoint = (model) => {
  const selected = chatProtocols.find(([
    protocol,
    path,
    base,
  ]) => model.endpoints?.some((endpoint) => endpoint.protocol === protocol
    && endpoint.path === path && endpoint.base_url === base && endpoint.auth === "bearer"));
  if (!selected) throw new Error("This model has no supported published chat protocol. Refresh the catalog before submitting.");
  return {
    protocol: selected[0],
    path: selected[1],
  };
};

/** Build a plain-text request for the selected native API. */
export const chatRequestData = ({
  protocol, model, prompt, systemPrompt, maxTokens,
}) => {
  if (protocol === "responses") {
    return {
      model,
      input: prompt,
      stream: false,
      ...(systemPrompt && {
        instructions: systemPrompt,
      }),
      ...(maxTokens !== undefined && {
        max_output_tokens: maxTokens,
      }),
    };
  }
  return {
    model,
    stream: false,
    messages: [
      ...(protocol === "chat_completions" && systemPrompt
        ? [
          {
            role: "system",
            content: systemPrompt,
          },
        ]
        : []),
      {
        role: "user",
        content: prompt,
      },
    ],
    ...(protocol === "messages" && systemPrompt && {
      system: systemPrompt,
    }),
    // Messages requires an output budget. This is not a model capacity claim.
    ...(protocol === "messages"
      ? {
        max_tokens: maxTokens ?? 4096,
      }
      : maxTokens !== undefined && {
        max_tokens: maxTokens,
      }),
  };
};

/** Verify the native response shape without pretending a pending response completed. */
export const confirmedChatResponse = (response, protocol) => {
  if (protocol === "messages") return response?.type === "message" && Array.isArray(response.content) && response.content.length > 0;
  if (protocol === "responses") return response?.object === "response" && response.status === "completed" && Array.isArray(response.output);
  return Array.isArray(response?.choices) && response.choices.length > 0;
};

/** Read model choices for one published media operation, preserving its actual API scope. */
export const modelsForOperation = (catalog, operation) => {
  if (!Array.isArray(catalog?.items)) throw new Error("Model discovery returned an invalid catalog.");
  const path = operation.startsWith("/openai/")
    ? operation.replace("/openai/", "/v1/")
    : operation;
  return catalog.items.filter((item) => item.endpoints?.some((endpoint) => endpoint.path === path && endpoint.auth === "bearer"));
};

/** Read the selected operation's request enum; response examples are not an inventory. */
export const operationModelIds = (api) => {
  const definition = api?.definition;
  const operation = definition?.paths?.[api.path]?.[(api.method || "POST").toLowerCase()];
  const parameter = api.metadata?.catalog?.model_parameter || "model";
  const ids = new Set();
  const resolve = (value, seen = new Set()) => {
    if (!value?.$ref?.startsWith("#/") || seen.has(value.$ref)) return value || {};
    const ref = value.$ref;
    const target = ref.slice(2).split("/")
      .reduce((node, part) => node?.[part.replace(/~1/g, "/").replace(/~0/g, "~")], definition);
    return resolve(target, new Set([
      ...seen,
      ref,
    ]));
  };
  const visit = (schema, seen = new Set()) => {
    const node = resolve(schema);
    if (seen.has(node)) return;
    seen.add(node);
    const model = resolve(node.properties?.[parameter]);
    for (const id of model.enum || []) if (typeof id === "string" && id) ids.add(id);
    for (const key of [
      "oneOf",
      "anyOf",
      "allOf",
    ]) {
      for (const child of node[key] || []) visit(child, seen);
    }
  };
  for (const content of Object.values(resolve(operation?.requestBody).content || {})) {
    visit(content.schema);
  }
  if (!ids.size) throw new Error("The published operation has no model choices.");
  return [
    ...ids,
  ];
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
      label: model.label || model.name || model.id,
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
