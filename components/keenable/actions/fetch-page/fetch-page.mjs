import app from "../../keenable.app.mjs";

export default {
  key: "keenable-fetch-page",
  name: "Fetch Page",
  description: "Fetch a web page and get its content as clean Markdown, with title, author and publish date. [See the documentation](https://docs.keenable.ai)",
  version: "0.0.1",
  type: "action",
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
      description: "Maximum number of characters of content to return. Defaults to 50000.",
      min: 1,
      optional: true,
    },
    live: {
      type: "boolean",
      label: "Live",
      description: "Fetch the live page instead of the indexed copy. Defaults to `false`.",
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
    const response = await this.app.fetchPage({
      $,
      params: {
        url: this.url,
        max_chars: this.maxChars,
        live: this.live,
        prompt: this.prompt,
      },
    });
    $.export("$summary", `Successfully fetched ${response.url || this.url}`);
    return response;
  },
};
