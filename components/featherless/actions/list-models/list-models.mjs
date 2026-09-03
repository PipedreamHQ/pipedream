// x-pd-ai: optimized
import featherless from "../../featherless.app.mjs";
import {
  COMPACT_MODEL_FIELDS, DEFAULT_PER_PAGE, MAX_PER_PAGE,
} from "../../common/constants.mjs";

export default {
  key: "featherless-list-models",
  name: "List Models",
  description: "List the models available on Featherless (GET /v1/models). Returns model objects each containing an `id` field to pass as the `model` prop in **Create Chat Completion** and **Create Text Completion**. The catalog is very large (~22k models), so results are paged (100 per page by default) and each model is trimmed to key fields (`id`, `name`, `model_class`, `context_length`, `max_completion_tokens`, `available_on_current_plan`); use `q` to search, `page` to page through, or `fields` to change which fields are returned. Example: `q=Qwen` returns Qwen-family models with ids like `Qwen/Qwen3-8B` (pass that id as the `model` prop in a completion). Results are paged (100 per page); increment `page` to fetch more. Because a page size is always sent, the response also includes `pagination` (`current_page`, `total_pages`, `total_items`) and a `total` count. [See the documentation](https://featherless.ai/docs/api-reference-models).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    featherless,
    q: {
      type: "string",
      label: "Search Query",
      description: "Optional free-text search query to filter models by name or id.",
      optional: true,
    },
    availableOnCurrentPlan: {
      type: "boolean",
      label: "Available on Current Plan",
      description: "When true, only return models available on the connected account's current plan (maps to `available_on_current_plan`).",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "Optional comma-separated tags to filter by, e.g. `chat,instruct`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number of results to fetch (1-based).",
      min: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: `Number of models to return per page. Min 1, max ${MAX_PER_PAGE} (maps to \`per_page\`). Defaults to ${DEFAULT_PER_PAGE}. Note the API floors values below 100 at 100 per page.`,
      min: 1,
      max: MAX_PER_PAGE,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `An array of field names to keep on each returned model, e.g. \`["id", "is_gated"]\`. Omit to use the compact default (${COMPACT_MODEL_FIELDS.join(", ")}). Available keys also include \`is_gated\` and other model metadata.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.featherless.listModels({
      $,
      params: {
        q: this.q,
        // Positive-only filter: the API documents passing `true`/`1` to filter
        // to plan-available models, so only send it when true (sending `false`
        // is undefined behavior — axios would transmit it since it's not
        // undefined).
        available_on_current_plan: this.availableOnCurrentPlan
          ? true
          : undefined,
        tags: this.tags,
        page: this.page,
        // Default to one bounded page — omitting per_page returns all ~22k
        // models (~7.8 MB), which overflows the tool-output cap.
        per_page: this.perPage ?? DEFAULT_PER_PAGE,
      },
    });
    const models = Array.isArray(response?.data)
      ? response.data
      : [];
    const fields = this.fields?.length
      ? this.fields
      : COMPACT_MODEL_FIELDS;
    // Trim each model to key fields so the (up to 100) rows fit in context.
    const data = models.map((model) => {
      const picked = {};
      for (const field of fields) {
        if (Object.hasOwn(model, field)) {
          picked[field] = model[field];
        }
      }
      return picked;
    });
    $.export("$summary", `Successfully retrieved ${data.length} models`);
    return {
      data,
      ...response?.pagination !== undefined && {
        pagination: response.pagination,
      },
      ...response?.total !== undefined && {
        total: response.total,
      },
    };
  },
};
