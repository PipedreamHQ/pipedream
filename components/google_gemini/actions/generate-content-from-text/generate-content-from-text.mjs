import { axios } from "@pipedream/platform";
import googleGemini from "../../google_gemini.app.mjs";

export default {
  key: "google_gemini-generate-content-from-text",
  name: "Generate Content from Text",
  description: "Generates content from text input using the Google Gemini API. [See the documentation](https://ai.google.dev/tutorials/node_quickstart)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    googleGemini,
    promptText: {
      propDefinition: [
        googleGemini,
        "promptText",
      ],
    },
    imagePaths: {
      propDefinition: [
        googleGemini,
        "imagePaths",
        (c) => ({
          mimeType: c.mimeType,
        }),
      ],
    },
    modelType: {
      propDefinition: [
        googleGemini,
        "modelType",
      ],
    },
    apiKey: {
      propDefinition: [
        googleGemini,
        "apiKey",
      ],
    },
    mimeType: {
      propDefinition: [
        googleGemini,
        "mimeType",
      ],
    },
    useStreaming: {
      propDefinition: [
        googleGemini,
        "useStreaming",
      ],
    },
  },
  async run({ $ }) {
    const {
      promptText, imagePaths, mimeType, modelType, useStreaming,
    } = this;
    let result;

    // Set the apiKey for the Gemini app methods
    this.googleGemini.apiKey = this.apiKey;

    if (modelType === "gemini-pro-vision" && imagePaths.length > 0) {
      // Use streaming if enabled and model is gemini-pro-vision
      if (useStreaming) {
        result = await this.googleGemini.generateContentStream(promptText, imagePaths, mimeType);
      } else {
        result = await this.googleGemini.generateContentFromTextAndImage(promptText, imagePaths, mimeType);
      }
    } else {
      // Use the text-only model
      result = await this.googleGemini.generateContentFromText(promptText);
    }

    $.export("$summary", "Content generated successfully");
    return result;
  },
};
