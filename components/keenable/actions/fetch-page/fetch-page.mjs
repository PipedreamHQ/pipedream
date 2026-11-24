import app from "../../keenable.app.mjs";

export default {
  key: "keenable-fetch-page",
  name: "Fetch Page",
  description: "Fetch a web page and get its content as clean Markdown, with title, author and publish date. [See the documentation](https://docs.keenable.ai/api-reference/fetch-post)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    maxChars: {
      type: "integer",
      label: "Max Characters",
      description: "Maximum number of characters of content to return. Defaults to 50000. Example: `10000`",
      min: 1,
      optional: true,
    },
    live: {
      type: "boolean",
      label: "Live",
      description: "Set to `true` to fetch the live page from the source (`retrieval.max_age_hours: 0`) instead of the indexed copy, e.g. for a page that changes often. Defaults to `false`. Example: `true`",
      optional: true,
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Optional extraction instruction. When set, only the output for this instruction is returned instead of the full page, e.g. `List all pricing tiers with their monthly prices`",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = { urls: [this.url] };
    const content = {};
    if (this.maxChars != null) content.max_chars = this.maxChars;
    if (this.prompt) content.prompt = this.prompt;
    if (Object.keys(content).length) data.content = content;
    if (this.live) data.retrieval = { max_age_hours: 0 };
    const response = await this.app.fetchPage({
      $,
      data,
    });
    const page = Array.isArray(response?.results) ? response.results[0] : response;
    if (page?.error) {
      throw new Error(page.error.message || page.error.error || "Keenable fetch failed");
    }
    $.export("$summary", `Successfully fetched ${page?.url || this.url}`);
    return page;
  },
};
