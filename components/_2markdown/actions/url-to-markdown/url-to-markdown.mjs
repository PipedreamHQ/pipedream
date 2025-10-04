import _2markdown from "../../_2markdown.app.mjs";

export default {
  key: "_2markdown-url-to-markdown",
  name: "URL to Markdown",
  description: "Extract the essential content of a website as plaintext. [See the documentation](https://2markdown.com/docs#url2md)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    _2markdown,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to be processed. Costs 1 credit per request.",
    },
    js: {
      type: "boolean",
      label: "Include Javascript Support",
      description: "Set to `true` to extract content as plaintext including any javascript-rendered resources. Costs an additional credit per request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fn = this.js
      ? this._2markdown.urlToMarkdownWithJs
      : this._2markdown.urlToMarkdown;

    const response = await fn({
      $,
      data: {
        url: this.url,
      },
    });

    $.export("$summary", "Successfully extracted website content.");

    return response;
  },
};
