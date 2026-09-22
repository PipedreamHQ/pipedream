import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-extract-content",
  name: "Extract Content",
  description: "Extract the readable content of a page as Markdown, JSON, or HTML. [See the documentation](https://rendex.dev/docs/api-reference#post-extract).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rendex,
    url: {
      type: "string",
      label: "URL",
      description: "The page URL to extract content from.",
    },
    extractFormat: {
      propDefinition: [
        rendex,
        "extractFormat",
      ],
    },
    waitUntil: {
      propDefinition: [
        rendex,
        "waitUntil",
      ],
    },
    delay: {
      propDefinition: [
        rendex,
        "delay",
      ],
    },
    timeout: {
      type: "integer",
      label: "Timeout (seconds)",
      description: "Maximum time to wait for the page to load (5–60).",
      optional: true,
      min: 5,
      max: 60,
    },
  },
  async run({ $ }) {
    const response = await this.rendex.extract({
      $,
      data: {
        url: this.url,
        extractFormat: this.extractFormat,
        waitUntil: this.waitUntil,
        delay: this.delay,
        timeout: this.timeout,
      },
    });

    const data = response.data;
    $.export("$summary", `Extracted content from ${this.url}`);
    return data;
  },
};
