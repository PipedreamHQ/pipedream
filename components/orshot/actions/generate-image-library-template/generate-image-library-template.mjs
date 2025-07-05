import orshot from "../app/orshot.app.mjs";

export default {
  key: "orshot-generate-image-library-template",
  name: "Generate Image from Library Template",
  description:
    "Generate an image from a pre-designed library template using the Orshot API",
  version: "0.1.0",
  type: "action",
  props: {
    orshot,
    templateId: {
      propDefinition: [
        orshot,
        "templateId",
      ],
    },
    responseType: {
      propDefinition: [
        orshot,
        "responseType",
      ],
    },
    responseFormat: {
      propDefinition: [
        orshot,
        "responseFormat",
      ],
    },
    modifications: {
      propDefinition: [
        orshot,
        "modifications",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      templateId,
      responseType,
      responseFormat,
      modifications = {},
    } = this;

    try {
      const response = await this.orshot.generateImageFromLibraryTemplate({
        $,
        templateId,
        modifications,
        responseType,
        responseFormat,
      });

      const result = {
        templateId,
        responseType,
        responseFormat,
        modifications,
        timestamp: new Date().toISOString(),
        source: "orshot-pipedream",
      };

      // Handle different response types
      switch (responseType) {
      case "base64":
        result.data = response;
        result.mimeType = this._getMimeType(responseFormat);
        break;
      case "binary":
        result.data = response;
        result.mimeType = this._getMimeType(responseFormat);
        break;
      case "url":
        result.data = response;
        break;
      default:
        result.data = response;
      }

      $.export(
        "$summary",
        `Successfully generated image from template ${templateId}`,
      );
      return result;
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      const errorResult = {
        error: errorMessage,
        templateId,
        responseType,
        responseFormat,
        modifications,
        timestamp: new Date().toISOString(),
      };

      if (error.response) {
        errorResult.httpStatus = error.response.status;
        errorResult.httpStatusText = error.response.statusText;

        try {
          errorResult.apiError =
            typeof error.response.data === "string"
              ? JSON.parse(error.response.data)
              : error.response.data;
        } catch {
          errorResult.rawResponse = error.response.data;
        }
      }

      throw new Error(`Failed to generate image: ${errorMessage}`);
    }
  },
  methods: {
    _getMimeType(format) {
      const mimeTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
        pdf: "application/pdf",
      };
      return mimeTypes[format] || "application/octet-stream";
    },
  },
};
