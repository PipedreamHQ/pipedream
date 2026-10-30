import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-weak-words-detect",
  name: "Detect Weak Words",
  description: "Analyze text and return weak, vague, or filler words with zero-based word positions to help writers produce clearer and more concise content. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "Text to analyze for weak words",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/readability/weak-words",
      data: {
        text: this.text,
      },
    });
    $.export("$summary", "Successfully executed Detect Weak Words");
    return response;
  },
};
