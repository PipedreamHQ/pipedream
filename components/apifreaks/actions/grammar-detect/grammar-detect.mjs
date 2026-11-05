import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-grammar-detect",
  name: "Detect Grammar Errors",
  description: "Analyze text for grammar errors and return the exact words flagged as grammatically incorrect with zero-based word positions. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "Text to analyze for grammar errors",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/readability/grammar/detect",
      data: {
        text: this.text,
      },
    });
    $.export("$summary", "Successfully executed Detect Grammar Errors");
    return response;
  },
};
