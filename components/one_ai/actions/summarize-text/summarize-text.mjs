import app from "../../one_ai.app.mjs";

export default {
  name: "Summarize Text",
  description: "Summarize a given text. [See the documentation](https://docs.oneai.com/docs/synchronous-pipelines).",
  key: "one_ai-summarize-text",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "Search to Summarize",
    },
  },
  async run({ $ }) {
    const res = await this.app.summarizeText(this.text);
    $.export("summary", "Text successfully summarized");
    return res;
  },
};
