import azureAiVision from "../../azure_ai_vision.app.mjs";

export default {
  key: "azure_ai_vision-extract-text-from-image",
  name: "Extract Text from Image",
  description: "Extracts text from the provided image using Azure AI Vision OCR. [See the documentation](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/unified-vision-apis-public-preview-2023-02-01-preview/operations/61d65934cd35050c20f73ab6)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    azureAiVision,
    image: {
      propDefinition: [
        azureAiVision,
        "image",
      ],
    },
    language: {
      propDefinition: [
        azureAiVision,
        "language",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureAiVision.analyzeImage({
      $,
      data: {
        url: this.image,
      },
      params: {
        "features": "read",
        "language": this.language,
      },
    });

    $.export("$summary", "Successfully extracted text from image");
    return response;
  },
};
