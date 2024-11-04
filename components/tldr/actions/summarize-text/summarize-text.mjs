import tldr from "../../tldr.app.mjs";

export default {
  key: "tldr-summarize-text",
  name: "Summarize Text",
  description: "Reads in a piece of text and distills the main points. [See the documentation](https://runtldr.com/documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tldr,
    inputText: {
      propDefinition: [
        tldr,
        "inputText",
      ],
    },
    responseStyle: {
      propDefinition: [
        tldr,
        "responseStyle",
      ],
    },
    responseLength: {
      propDefinition: [
        tldr,
        "responseLength",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tldr.summarize({
      inputText: this.inputText,
      responseLength: this.responseLength || undefined,
      responseStyle: this.responseStyle || undefined,
    });

    const summary = response.output.summary;
    $.export("$summary", `Successfully summarized the text with the following summary: "${summary}"`);
    return response.output;
  },
};
