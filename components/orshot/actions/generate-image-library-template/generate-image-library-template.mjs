import orshot from "../../orshot.app.mjs";
import {
  getMimeType, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "orshot-generate-image-library-template",
  name: "Generate Image from Library Template",
  description:
    "Generate an image from a pre-designed library template using the Orshot API. [See the documentation](https://orshot.com/docs/api-reference/render-from-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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

    const validModifications = parseObject(modifications);

    try {
      const response = await this.orshot.generateImageFromLibraryTemplate({
        $,
        data: {
          templateId,
          modifications: validModifications,
          response: {
            type: responseType,
            format: responseFormat,
          },
          source: "orshot-pipedream",
        },
      });

      const result = {
        templateId,
        responseType,
        responseFormat,
        modifications: validModifications,
        timestamp: new Date().toISOString(),
      };

      // Handle different response types
      switch (responseType) {
      case "base64":
        result.data = response.data;
        result.mimeType = getMimeType(responseFormat);
        break;
      case "binary":
        result.data = response;
        result.mimeType = getMimeType(responseFormat);
        break;
      case "url":
        result.data = response.data;
        break;
      default:
        result.data = response.data;
      }

      $.export(
        "$summary",
        `Successfully generated image from template ${templateId}`,
      );
      return result;
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      throw new Error(`Failed to generate image: ${errorMessage}`);
    }
  },
};
