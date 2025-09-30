import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import mime from "mime";
import common from "../common/generate-content.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "google_gemini-generate-content-from-text-and-image",
  name: "Generate Content from Text and Image",
  description: "Generates content from both text and image input using the Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-and-image_input)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    mediaFiles: {
      type: "string[]",
      label: "Media File Paths or URLs",
      description: "A list of file paths from the `/tmp` directory or URLs for the media to process.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
    async fileToGenerativePart(file) {
      if (!file) {
        return;
      }

      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);

      const data = await this.streamToBase64(stream);

      return {
        inline_data: {
          mime_type: metadata.contentType ?? mime.getType(metadata.name),
          data,
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
      mediaFiles,
      safetySettings,
      responseFormat,
      responseSchema,
      maxOutputTokens,
      temperature,
      topP,
      topK,
      stopSequences,
    } = this;

    if (!Array.isArray(mediaFiles)) {
      throw new ConfigurationError("Image/Video files must be an array.");
    }

    if (!mediaFiles.length) {
      throw new ConfigurationError("At least one media file must be provided.");
    }

    const contents = [
      ...this.formatHistoryToContent(history),
      {
        parts: [
          ...(await Promise.all(mediaFiles.map((path) => this.fileToGenerativePart(path)))),
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
