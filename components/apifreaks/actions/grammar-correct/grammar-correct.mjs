import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-grammar-correct",
  name: "Correct Grammar",
  description: "Submit text with grammatical issues and receive a clean grammar-corrected result for proofreading and content workflows. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "Text to correct",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/readability/grammar/correct",
      data: {
        text: this.text,
      },
    });
    $.export("$summary", "Successfully executed Correct Grammar");
    return response;
  },
};
