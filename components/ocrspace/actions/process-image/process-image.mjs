import ocrspace from "../../ocrspace.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ocrspace-process-image",
  name: "Process Image",
  description: "Submits an image file for OCR processing using OCR.space. [See the documentation](https://ocr.space/ocrapi)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ocrspace: {
      type: "app",
      app: "ocrspace",
    },
    imageUrl: {
      propDefinition: [
        "ocrspace",
        "imageUrl",
      ],
    },
    imageFile: {
      propDefinition: [
        "ocrspace",
        "imageFile",
      ],
    },
    imageLanguage: {
      propDefinition: [
        "ocrspace",
        "imageLanguage",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.imageUrl && !this.imageFile) {
      throw new Error("Either Image File URL or Image File Upload must be provided.");
    }

    const response = await this.ocrspace.submitImage({
      imageUrl: this.imageUrl,
      imageFile: this.imageFile,
      imageLanguage: this.imageLanguage,
    });

    const summary = response.JobId
      ? `Image submitted for OCR processing. Job ID: ${response.JobId}`
      : "Image submitted for OCR processing.";

    $.export("$summary", summary);
    return response;
  },
};
