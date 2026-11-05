import { ConfigurationError } from "@pipedream/platform";
import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-extract-pages",
  name: "Extract Pages",
  description: "Read up to 20 URLs (HTML or PDF) as Markdown. With a query and highlights, return only the passages most relevant to the query; with Summary, a short AI summary; with Output Schema, structured JSON. Summaries and schema extraction cost extra credits; failed URLs and failed AI steps are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/extract)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "1 to 20 public HTML pages or PDFs, e.g. `[\"https://example.com/pricing\", \"https://example.com/report.pdf\"]`.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "What to rank passages against (with Highlights) or focus summaries on, e.g. `pricing tiers and limits`.",
      optional: true,
    },
    highlights: {
      type: "integer",
      label: "Highlights",
      description: "Passages per page ranked against Query, from 0 (full page) to 10, e.g. `3`. Needs Query.",
      optional: true,
      min: 0,
      max: 10,
    },
    summary: {
      type: "boolean",
      label: "Summary",
      description: "Add a 3-6 sentence AI summary of each page in `summary`, e.g. `true`. Costs extra credits.",
      optional: true,
    },
    outputSchema: {
      type: "string",
      label: "Output Schema",
      description: "A JSON Schema object, as JSON text, e.g. `{\"type\": \"object\", \"properties\": {\"title\": {\"type\": \"string\"}, \"price\": {\"type\": \"number\"}}}`. Each page's data is returned as JSON matching it in `output`. Costs extra credits.",
      optional: true,
    },
    prompt: {
      type: "string",
      label: "Extraction Prompt",
      description: "Guides Output Schema extraction: what to pick and how to normalise it, e.g. `Use the monthly price in USD`. Needs Output Schema.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Trim each page to about this many tokens, from 100 to 100,000, e.g. `2000`.",
      optional: true,
      min: 100,
      max: 100000,
    },
  },
  async run({ $ }) {
    if (!this.urls?.length || this.urls.length > 20) {
      throw new ConfigurationError("URLs must contain 1 to 20 entries.");
    }
    let outputSchema;
    if (this.outputSchema) {
      try {
        outputSchema = JSON.parse(this.outputSchema);
      } catch {
        throw new ConfigurationError("Output Schema must be valid JSON.");
      }
      if (!outputSchema || typeof outputSchema !== "object" || Array.isArray(outputSchema)) {
        throw new ConfigurationError("Output Schema must be a JSON object, e.g. `{\"type\": \"object\"}`.");
      }
    }
    const response = await this.app.extractPages({
      $,
      data: {
        urls: this.urls,
        query: this.query,
        highlights: this.highlights,
        summary: this.summary,
        prompt: this.prompt,
        max_tokens: this.maxTokens,
        output_schema: outputSchema,
      },
    });
    $.export("$summary", `Read ${response.results?.length ?? 0} pages (${response.failed?.length ?? 0} failed)`);
    return response;
  },
};
