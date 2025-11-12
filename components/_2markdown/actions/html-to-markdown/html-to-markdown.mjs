import _2markdown from "../../_2markdown.app.mjs";

export default {
  key: "_2markdown-html-to-markdown",
  name: "HTML to Markdown",
  description: "Convert raw HTML content to Markdown format. [See the documentation](https://2markdown.com/docs#html2md)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    _2markdown,
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML content to be converted to Markdown",
    },
  },
  async run({ $ }) {
    const response = await this._2markdown.htmlToMarkdown({
      $,
      data: {
        html: this.html,
      },
    });

    $.export("$summary", "Successfully converted HTML to markdown.");

    return response;
  },
};
