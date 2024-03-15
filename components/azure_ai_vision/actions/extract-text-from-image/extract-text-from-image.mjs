import azureAiVision from "../../azure_ai_vision.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "azure_ai_vision-extract-text-from-image",
  name: "Extract Text from Image",
  description: "Extracts text from the provided image using Azure AI Vision OCR. [See the documentation](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/unified-vision-apis-public-preview-2023-02-01-preview/operations/63c227a15ddd17166ce42747)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    azureAiVision,
    endpoint: azureAiVision.propDefinitions.endpoint,
    subscriptionKey: azureAiVision.propDefinitions.subscriptionKey,
    image: azureAiVision.propDefinitions.image,
    language: azureAiVision.propDefinitions.language,
  },
  async run({ $ }) {
    const response = await this.azureAiVision.analyzeImage({
      image: this.image,
      language: this.language,
    });

    $.export("$summary", "Successfully extracted text from image");
    return response;
  },
};
