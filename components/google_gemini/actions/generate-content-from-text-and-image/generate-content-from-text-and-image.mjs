import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/generate-content.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "google_gemini-generate-content-from-text-and-image",
  name: "Generate Content from Text and Image",
  description: "Generates content from both text and image input using the Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-and-image_input)",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
    text: {
      propDefinition: [
        common.props.app,
        "text",
      ],
    },
    mimeType: {
      propDefinition: [
        common.props.app,
        "mimeType",
      ],
    },
    imagePaths: {
      propDefinition: [
        common.props.app,
        "imagePaths",
      ],
    },
    responseFormat: {
      propDefinition: [
        common.props.app,
        "responseFormat",
      ],
    },
  },
  methods: {
    fileToGenerativePart(path, mimeType) {
      if (!path) {
        return;
      }
      return {
        inline_data: {
          mime_type: mimeType,
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        },
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      model,
      text,
      imagePaths,
      mimeType,
      responseFormat,
      responseSchema,
      maxOutputTokens,
      temperature,
      topP,
      topK,
      stopSequences,
    } = this;

    if (!Array.isArray(imagePaths)) {
      throw new ConfigurationError("Image paths must be an array.");
    }

    if (!imagePaths.length) {
      throw new ConfigurationError("At least one image path must be provided.");
    }

    const response = await app.generateContent({
      $,
      model,
      data: {
        contents: [
          {
            parts: [
              {
                text,
              },
              ...imagePaths.map((path) => this.fileToGenerativePart(path, mimeType)),
            ],
          },
        ],
        ...(
          responseFormat || maxOutputTokens || temperature || topP || topK || stopSequences?.length
            ? {
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: utils.parse(responseSchema),
                maxOutputTokens,
                temperature,
                topP,
                topK,
                stopSequences,
              },
            }
            : {}
        ),
      },
    });

    $.export("$summary", "Successfully generated content from text and image.");

    return response;
  },
};
