import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  type: "app",
  app: "google_gemini",
  version: "0.0.{{ts}}",
  propDefinitions: {
    promptText: {
      type: "string",
      label: "Prompt Text",
      description: "The text to use as the prompt for content generation",
    },
    imagePaths: {
      type: "string[]",
      label: "Image File Paths",
      description: "The local file paths of the images to use in the content generation",
    },
    modelType: {
      type: "string",
      label: "Model Type",
      description: "The model type to use for content generation",
      options: [
        {
          label: "Text-Only",
          value: "gemini-pro",
        },
        {
          label: "Text and Image",
          value: "gemini-pro-vision",
        },
      ],
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API key for the Gemini API",
      secret: true,
    },
    mimeType: {
      type: "string",
      label: "MIME Type",
      description: "The MIME type of the images",
      options: [
        {
          label: "PNG",
          value: "image/png",
        },
        {
          label: "JPEG",
          value: "image/jpeg",
        },
      ],
    },
    useStreaming: {
      type: "boolean",
      label: "Use Streaming",
      description: "Whether to use streaming for faster interactions",
      default: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://ai.google.dev";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.apiKey}`,
        },
        data,
        params,
      });
    },
    fileToGenerativePart(path, mimeType) {
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType,
        },
      };
    },
    async generateContentFromText(prompt) {
      const model = this.modelType === "gemini-pro-vision"
        ? "gemini-pro-vision"
        : "gemini-pro";
      const result = await this._makeRequest({
        method: "POST",
        path: "/tutorials/node_quickstart",
        data: {
          prompt,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    },
    async generateContentFromTextAndImage(prompt, imagePaths, mimeType) {
      const imageParts = imagePaths.map((path) => this.fileToGenerativePart(path, mimeType));
      const result = await this._makeRequest({
        method: "POST",
        path: "/tutorials/node_quickstart",
        data: {
          prompt,
          imageParts,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return result;
    },
    async generateContentStream(prompt, imagePaths, mimeType) {
      if (!this.useStreaming) {
        return this.generateContentFromTextAndImage(prompt, imagePaths, mimeType);
      }
      const imageParts = imagePaths.map((path) => this.fileToGenerativePart(path, mimeType));
      const result = await this._makeRequest({
        method: "POST",
        path: "/tutorials/node_quickstart",
        data: {
          prompt,
          imageParts,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      let text = "";
      for await (const chunk of result.stream()) {
        text += chunk.text();
      }
      return text;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
