import app from "../../lettria.app.mjs";

export default {
  name: "Classify Text",
  description: "Classify one text. [See the documentation](https://doc.lettria.com/api-reference/classification/2.0/get-started/first-request).",
  key: "lettria-classify-text",
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
      description: "Text to be classified.",
    },
  },
  async run({ $ }) {
    const res = await this.app.classifyText(
      this.text,
      $,
    );
    $.export("$summary", "Text successfully classified");
    return res[0];
  },
};
