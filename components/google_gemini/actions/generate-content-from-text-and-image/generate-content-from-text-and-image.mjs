import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_gemini.app.mjs";

export default {
  key: "google_gemini-generate-content-from-text-and-image",
  name: "Generate Content from Text and Image",
  description: "Generates content from both text and image input using the Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-and-image_input)",
  version: "0.1.0",
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    mimeType: {
      propDefinition: [
        app,
        "mimeType",
      ],
    },
    imagePaths: {
      propDefinition: [
        app,
        "imagePaths",
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
      },
    });

    $.export("$summary", "Successfully generated content from text and image.");

    return response;
  },
};
