import ocrspace from "../../ocrspace.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ocrspace-get-ocr-result",
  name: "Get OCR Result",
  description: "Retrieves the processed OCR result for a specific job ID. [See the documentation](https://ocr.space/ocrapi)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ocrspace,
    jobId: {
      propDefinition: [
        ocrspace,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.ocrspace.retrieveOcrResult({
      jobId: this.jobId,
    });
    $.export("$summary", `Retrieved OCR result for job ID ${this.jobId}`);
    return result;
  },
};
