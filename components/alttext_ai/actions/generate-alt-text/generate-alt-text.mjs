import alttextAi from "../../alttext_ai.app.mjs";
import fs from "fs";
import { LANGUAGE_OPTIONS } from "../../commons/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "alttext_ai-generate-alt-text",
  name: "Generate Alt Text",
  description:
    "Generates a descriptive alt text for a given image. [See the documentation](https://alttext.ai/apidocs#tag/Images/operation/create-image)",
  version: "0.0.1",
  type: "action",
  props: {
    alttextAi,
    imageData: {
      type: "string",
      label: "Image Data",
      description:
        "The image data in base64 format. Only one of `Image Data`, `Image File Path` or `Image URL` should be specified.",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description:
        "The public URL to an image. Only one of `Image URL`, `Image Data` or `Image File Path` should be specified.",
      optional: true,
    },
    imageFilePath: {
      type: "string",
      label: "Image File Path",
      description:
        "The path to an image file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory). Only one of `Image File Path`, `Image URL` or `Image Data` should be specified.",
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
  },
  async run({ $ }) {
    if (
      (!this.imageData && !this.imageFilePath && !this.imageUrl)
      || (this.imageData && this.imageFilePath)
      || (this.imageData && this.imageUrl)
      || (this.imageFilePath && this.imageUrl)
    ) {
      throw new ConfigurationError("Only one of `Image Data`, `Image File Path` or `Image URL` should be specified.");
    }

    const response = await this.alttextAi.generateAltText({
      $,
      data: {
        image: {
          url: this.imageUrl,
          raw:
            this.imageData ??
            (this.imageFilePath &&
              fs.readFileSync(
                this.imageFilePath.includes("tmp/")
                  ? this.imageFilePath
                  : `/tmp/${this.imageFilePath}`,
                {
                  encoding: "base64",
                },
              )),
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
