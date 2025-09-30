import tldr from "../../tldr.app.mjs";

export default {
  key: "tldr-summarize-text",
  name: "Summarize Text",
  description: "Reads in a piece of text and distills the main points. [See the documentation](https://runtldr.com/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tldr,
    inputText: {
      type: "string",
      label: "Text to Summarize",
      description: "The text that needs to be summarized.",
    },
    responseStyle: {
      type: "string",
      label: "Response Style",
      description: "Style of the response (e.g., Funny, Serious).",
    },
    responseLength: {
      type: "integer",
      label: "Response Length",
      description: "Length of the response summary.",
    },
  },
  async run({ $ }) {
    const response = await this.tldr.summarize({
      $,
      data: {
        inputText: this.inputText,
        responseLength: this.responseLength,
        responseStyle: this.responseStyle,
      },
    });

    $.export("$summary", `Successfully summarized the text with the following input: "${this.inputText}"`);
    return response;
  },
};
