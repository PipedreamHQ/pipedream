import googleGemini from "../../google_gemini.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "google_gemini-generate-content-from-text-and-image",
  name: "Generate Content from Text and Image",
  description: "Generates content from both text and image input using the Gemini API. [See the documentation](https://ai.google.dev/tutorials/node_quickstart)",
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
    const mimeType = this.mimeType;
    const imagePaths = this.imagePaths;
    const prompt = this.promptText;
    const useStreaming = this.useStreaming;

    this.googleGemini.apiKey = this.apiKey;
    this.googleGemini.modelType = this.modelType;
    this.googleGemini.useStreaming = this.useStreaming;

    let response;

    if (useStreaming) {
      response = await this.googleGemini.generateContentStream(prompt, imagePaths, mimeType);
    } else {
      response = await this.googleGemini.generateContentFromTextAndImage(prompt, imagePaths, mimeType);
    }

    $.export("$summary", "Generated content from text and image input using the Gemini API");
    return response;
  },
};
