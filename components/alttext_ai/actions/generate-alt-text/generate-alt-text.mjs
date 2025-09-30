import alttextAi from "../../alttext_ai.app.mjs";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "../../commons/constants.mjs";

export default {
  key: "alttext_ai-generate-alt-text",
  name: "Generate Alt Text",
  description:
    "Generates a descriptive alt text for a given image. [See the documentation](https://alttext.ai/apidocs#tag/Images/operation/create-image)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    alttextAi,
    fileInfo: {
      type: "alert",
      alertType: "warning",
      content: "Either `Image Data` or `Image File Path or URL` should be provided. If both are provided, `Image Data` will be used.",
    },
    imageData: {
      type: "string",
      label: "Image Data",
      description:
        "The image data in base64 format",
      optional: true,
    },
    imageFilePath: {
      type: "string",
      label: "Image File Path or URL",
      description:
        "The image to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myImage.jpg`)",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description:
        "Keywords / phrases to be considered when generating the alt text. Keywords must be in English, even if requesting alt text in another language. Max 6 items.",
      optional: true,
    },
    negativeKeywords: {
      type: "string[]",
      label: "Negative Keywords",
      description:
        "Negative keywords / phrases to be removed from any generated alt text. Negative keywords must be in English, even if requesting alt text in another language. Max 6 items.",
      optional: true,
    },
    keywordSource: {
      type: "string",
      label: "Keyword Source",
      description:
        "Text to use as the source of keywords for the alt text. Will only be used if `Keywords` is not provided. This text might be a product description, or a paragraph that describes the context of the images, etc. Max 1024 characters.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language for the generated alt text.",
      options: LANGUAGE_OPTIONS,
      default: "en",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      imageData, imageFilePath,
    } = this;
    if (!imageData && !imageFilePath) {
      throw new ConfigurationError("Either `Image Data` or `Image File Path or URL` should be specified.");
    }

    let rawData = imageData;
    if (!rawData) {
      const stream = await getFileStream(imageFilePath);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      rawData = buffer.toString("base64");
    }

    const response = await this.alttextAi.generateAltText({
      $,
      data: {
        image: {
          raw: rawData,
        },
        keywords: this.keywords,
        negative_keywords: this.negativeKeywords,
        keyword_source: this.keywordSource,
        lang: this.language,
      },
    });

    $.export("$summary", "Generated alt text successfully");
    return response;
  },
};
