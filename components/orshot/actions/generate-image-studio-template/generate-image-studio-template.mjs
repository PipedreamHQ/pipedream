import orshot from "../app/orshot.app.mjs";

export default {
  key: "orshot-generate-image-studio-template",
  name: "Generate Image from Studio Template",
  description:
    "Generate an image from an Orshot Studio template using the Orshot API",
  version: "0.1.1",
  type: "action",
  props: {
    orshot,
    templateId: {
      propDefinition: [
        orshot,
        "studioTemplateId",
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

    // Input validation
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    if (!responseType) {
      throw new Error("Response type is required");
    }

    if (!responseFormat) {
      throw new Error("Response format is required");
    }

    // Validate responseType
    const validResponseTypes = [
      "base64",
      "binary",
      "url",
    ];
    if (!validResponseTypes.includes(responseType)) {
      throw new Error(
        `Invalid response type. Must be one of: ${validResponseTypes.join(
          ", ",
        )}`,
      );
    }

    // Validate responseFormat
    const validFormats = [
      "png",
      "jpg",
      "jpeg",
      "webp",
    ];
    if (!validFormats.includes(responseFormat.toLowerCase())) {
      throw new Error(
        `Invalid response format. Must be one of: ${validFormats.join(", ")}`,
      );
    }

    // Validate modifications if provided
    if (modifications && typeof modifications !== "object") {
      throw new Error("Modifications must be an object");
    }

    // Ensure modifications is not null
    const validModifications = modifications || {};

    try {
      const response = await this.orshot.generateImageFromStudioTemplate({
        $,
        templateId,
        modifications: validModifications,
        responseType,
        responseFormat,
      });

      const result = {
        templateId,
        responseType,
        responseFormat,
        modifications: validModifications,
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
        `Successfully generated image from studio template ${templateId}`,
      );
      return result;
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      const errorResult = {
        error: errorMessage,
        templateId,
        responseType,
        responseFormat,
        modifications: validModifications,
        timestamp: new Date().toISOString(),
        source: "orshot-pipedream",
      };

      // Enhanced error handling for different error types
      if (error.response) {
        errorResult.httpStatus = error.response.status;
        errorResult.httpStatusText = error.response.statusText;

        try {
          errorResult.apiError =
            typeof error.response.data === "string"
              ? JSON.parse(error.response.data)
              : error.response.data;
        } catch (parseError) {
          errorResult.rawResponse = error.response.data;
          errorResult.parseError = parseError.message;
        }
      } else if (error.code) {
        // Handle network/connection errors
        errorResult.errorCode = error.code;
        errorResult.errorType = "network";
      } else if (error.name) {
        // Handle other types of errors
        errorResult.errorName = error.name;
        errorResult.errorType = "application";
      }

      throw new Error(`Failed to generate image: ${errorMessage}`);
    }
  },
  methods: {
    /**
     * Get the MIME type for a given file format
     * @param {string} format - The file format (e.g., 'png', 'jpg')
     * @returns {string} The corresponding MIME type
     */
    _getMimeType(format) {
      if (!format || typeof format !== "string") {
        return "application/octet-stream";
      }

      const mimeTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
      };

      const normalizedFormat = format.toLowerCase().trim();
      return mimeTypes[normalizedFormat] || "application/octet-stream";
    },
  },
};
