import fs from "fs";
import mime from "mime";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/generate-content.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "google_gemini-generate-content-from-text-and-image",
  name: "Generate Content from Text and Image",
  description: "Generates content from both text and image input using the Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-and-image_input)",
  version: "0.2.0",
  type: "action",
  props: {
    ...common.props,
    mediaPaths: {
      propDefinition: [
        common.props.app,
        "mediaPaths",
      ],
    },
  },
  methods: {
    ...common.methods,
    fileToGenerativePart(filePath) {
      if (!filePath) {
        return;
      }

      const mimeType = mime.getType(filePath);

      return {
        inline_data: {
          mime_type: mimeType,
          data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
        },
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      model,
      text,
      history,
      mediaPaths,
      safetySettings,
      responseFormat,
      responseSchema,
      maxOutputTokens,
      temperature,
      topP,
      topK,
      stopSequences,
    } = this;

    if (!Array.isArray(mediaPaths)) {
      throw new ConfigurationError("Image/Video paths must be an array.");
    }

    if (!mediaPaths.length) {
      throw new ConfigurationError("At least one media path must be provided.");
    }

    const contents = [
      ...this.formatHistoryToContent(history),
      {
        parts: [
          ...mediaPaths.map((path) => this.fileToGenerativePart(path)),
          {
            text,
          },
        ],
        role: "user",
      },
    ];

    const response = await app.generateContent({
      $,
      model,
      data: {
        contents,
        safetySettings: this.formatSafetySettings(safetySettings),
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
