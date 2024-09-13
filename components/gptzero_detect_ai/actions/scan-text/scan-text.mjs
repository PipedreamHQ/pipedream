import gptzeroDetectAi from "../../gptzero_detect_ai.app.mjs";

export default {
  key: "gptzero_detect_ai-scan-text",
  name: "Scan Text for AI Detection",
  description: "This endpoint takes in a single text input and runs AI detection. The document will be truncated to 50,000 characters. [See the documentation](https://gptzero.stoplight.io/docs/gptzero-api/d2144a785776b-ai-detection-on-single-string)",
  version: "0.0.1",
  type: "action",
  props: {
    gptzeroDetectAi,
    document: {
      type: "string",
      label: "Document",
      description: "The text you want to analyze. The text will be truncated to 50,000 characters.",
    },
    multilingual: {
      type: "boolean",
      label: "Multilingual",
      description: "When this option is `true`, a special multilingual AI detection model will be used. Currently supported languages are French and Spanish.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gptzeroDetectAi.detectText({
      $,
      data: {
        document: this.document,
        multilingual: this.multilingual,
      },
    });

    $.export("$summary", "Successfully ran AI detection on the document.");
    return response;
  },
};
