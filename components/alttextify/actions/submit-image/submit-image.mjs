import { getFileStreamAndMetadata } from "@pipedream/platform";
import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-submit-image",
  name: "Submit Image to Alttextify",
  description: "Upload or submit an image to Alttextify for alt text generation. [See the documentation](https://apidoc.alttextify.net/#api-Image-UploadRawImage)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    alttextify,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Supported formats: JPEG, PNG, GIF, WEBP, BMP\nMaximum file size: 16 MB\nMinimum dimensions: 50 x 50 (smaller images may not be able to generate alt text).",
    },
    async: {
      type: "boolean",
      label: "Async",
      description: "Whether to add the image in the background or immediately (synchronously). If async is set to true, the API response will always be successful with an empty response body.",
      default: false,
    },
    image: {
      type: "string",
      label: "Image",
      description: "The URL of the file or path to the file saved to the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    lang: {
      type: "string",
      label: "Language",
      description: "The language for the alt text. Supported language codes are accepted. If not provided, the account's default language is used.",
      default: "en",
    },
    maxChars: {
      type: "integer",
      label: "Max Characters",
      description: "Maximum length of the generated alt text.",
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The unique identifier for the asset.",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "List of keywords/phrases for SEO-optimized alt text. Only one or two will be used per alt text, but all are considered. Keywords must be in English, even for alt text in other languages.",
      optional: true,
    },
    ecommerceRunOCR: {
      type: "boolean",
      label: "Ecommerce Run OCR",
      description: "Flag to indicate if OCR should be run on the product.",
    },
    ecommerceProductName: {
      type: "string",
      label: "Ecommerce Product Name",
      description: "The name of the product in the image.",
      optional: true,
    },
    ecommerceProductBrand: {
      type: "string",
      label: "Ecommerce Product Brand",
      description: "The brand of the product in the image.",
      optional: true,
    },
    ecommerceProductColor: {
      type: "string",
      label: "Ecommerce Product Color",
      description: "The color of the product in the image.",
      optional: true,
    },
    ecommerceProductSize: {
      type: "string",
      label: "Ecommerce Product Size",
      description: "The size of the product in the image.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    async streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];

        stream.on("data", (chunk) => {
          chunks.push(chunk);
        });

        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });

        stream.on("error", (err) => {
          reject(err);
        });
      });
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.image);
    const base64String = await this.streamToBase64(stream);

    const response = await this.alttextify.uploadImage({
      $,
      data: {
        async: this.async,
        image: `data:${metadata.contentType};base64,${base64String}`,
        lang: this.lang,
        maxChars: this.maxChars,
        assetId: this.assetId,
        keywords: this.keywords,
        ecommerce: {
          run_ocr: this.ecommerceRunOCR,
          product: {
            name: this.ecommerceProductName,
            brand: this.ecommerceProductBrand,
            color: this.ecommerceProductColor,
            size: this.ecommerceProductSize,
          },
        },
      },

    });

    $.export("$summary", `Successfully submitted image to Alttextify for alt text generation with Asset ID: ${response.asset_id}`);
    return response;
  },
};
