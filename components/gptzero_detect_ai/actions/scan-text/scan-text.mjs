import gptzeroDetectAi from "../../gptzero_detect_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gptzero_detect_ai-scan-text",
  name: "Scan Text for AI Detection",
  description: "This endpoint takes in a single text input and runs AI detection. The document will be truncated to 50,000 characters. [See the documentation](https://gptzero.stoplight.io/docs/gptzero-api/d2144a785776b-ai-detection-on-single-string)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gptzeroDetectAi,
    document: {
      propDefinition: [
        gptzeroDetectAi,
        "document",
      ],
    },
    version: {
      propDefinition: [
        gptzeroDetectAi,
        "version",
      ],
    },
    multilingual: {
      propDefinition: [
        gptzeroDetectAi,
        "multilingual",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gptzeroDetectAi.detectText({
      document: this.document,
      version: this.version,
      multilingual: this.multilingual,
    });

    $.export("$summary", "Successfully ran AI detection on the document.");
    return response;
  },
};
