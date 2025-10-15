import app from "../../perplexity.app.mjs";

export default {
  key: "perplexity-chat-completions-advanced",
  name: "Chat Completions (Advanced)",
  description: "Generates a model's response for the given chat conversation with multi-message support and Perplexity search controls. Docs: https://docs.perplexity.ai/api-reference/chat-completions-post",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    messages: {
      type: "string[]",
      label: "Messages (JSON strings or UI collection)",
      description: "Array of message objects: [{ role: 'system'|'user'|'assistant', content: '...' }, ...]. If provided, 'role' and 'content' are ignored.",
      optional: true,
    },
    system: {
      type: "string",
      label: "System",
      description: "Optional system prompt injected as the first message",
      optional: true,
    },
    role: {
      propDefinition: [
        app,
        "role",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Sampling temperature. Higher values = more diverse output.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top-p",
      description: "Nucleus sampling probability mass. Use either temperature or top_p.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Output Tokens",
      description: "Cap response length (Sonar Pro practical max output ~8k).",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Enable server-side streaming. This action will still buffer and return the final text.",
      optional: true,
      default: false,
    },
    searchDomainFilter: {
      type: "string[]",
      label: "Search Domain Filter",
      description: "Limit web search to these domains (e.g., ['sec.gov','ft.com'])",
      optional: true,
    },
    searchRecencyFilter: {
      type: "string",
      label: "Search Recency Filter",
      description: "Prefer recent sources (e.g., 'day', 'week', 'month', 'year')",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Restrict number of retrieved items considered",
      optional: true,
    },
    returnImages: {
      type: "boolean",
      label: "Return Images",
      description: "Ask API to include images when applicable",
      optional: true,
      default: false,
    },
    returnRelatedQuestions: {
      type: "boolean",
      label: "Return Related Questions",
      description: "Ask API to include related questions in response",
      optional: true,
      default: false,
    },
  },

  async run({ $ }) {
    // Build messages array
    let messages = [];
    const provided = this.messages && this.messages.length > 0;

    if (provided) {
      // Accept messages as array of either objects or JSON strings
      messages = this.messages.map((m) =>
        typeof m === "string"
          ? JSON.parse(m)
          : m);
    } else {
      if (!this.content) {
        throw new Error("Either provide `messages` or `content`.");
      }
      // Back-compat single-turn
      if (this.system) {
        messages.push({
          role: "system",
          content: this.system,
        });
      }
      messages.push({
        role: this.role || "user",
        content: this.content,
      });
    }

    const data = {
      model: this.model,
      messages,
      // Generation knobs
      ...(this.temperature != null && {
        temperature: +this.temperature,
      }),
      ...(this.topP != null && {
        top_p: +this.topP,
      }),
      ...(this.maxTokens != null && {
        max_tokens: this.maxTokens,
      }),
      ...(this.stream != null && {
        stream: this.stream,
      }),
      // Perplexity search controls
      ...(this.searchDomainFilter && {
        search_domain_filter: this.searchDomainFilter,
      }),
      ...(this.searchRecencyFilter && {
        search_recency_filter: this.searchRecencyFilter,
      }),
      ...(this.topK != null && {
        top_k: this.topK,
      }),
      ...(this.returnImages != null && {
        return_images: this.returnImages,
      }),
      ...(this.returnRelatedQuestions != null && {
        return_related_questions: this.returnRelatedQuestions,
      }),
    };

    const response = await this.app.chatCompletions({
      $,
      data,
    });

    $.export(
      "$summary",
      `Perplexity ${this.model} responded${
        this.stream
          ? " (streaming buffered)"
          : ""
      }`,
    );

    return response;
  },
};
