import fs from "fs";
import alttextify from "../../alttextify.app.mjs";
import { checkTmp } from "../../common/utils.mjs";

export default {
  key: "alttextify-submit-image",
  name: "Submit Image to Alttextify",
  description: "Upload or submit an image to Alttextify for alt text generation. [See the documentation](https://apidoc.alttextify.net/#api-Image-UploadRawImage)",
  version: "0.0.1",
  type: "action",
  props: {
    alttextify,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Supported formats: JPEG, PNG, GIF, WEBP, BMP\nMaximum file size: 16 MB\nMinimum dimensions: 50 x 50 (smaller images may not be able to generate alt text).",
    },
    async: {
      propDefinition: [
        alttextify,
        "async",
      ],
    },
    image: {
      type: "string",
      label: "Image Path",
      description: "The path to the image file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    lang: {
      propDefinition: [
        alttextify,
        "lang",
      ],
    },
    maxChars: {
      propDefinition: [
        alttextify,
        "maxChars",
      ],
    },
    assetId: {
      propDefinition: [
        alttextify,
        "assetId",
      ],
    },
    keywords: {
      propDefinition: [
        alttextify,
        "keywords",
      ],
    },
    ecommerceRunOCR: {
      propDefinition: [
        alttextify,
        "ecommerceRunOCR",
      ],
    },
    ecommerceProductName: {
      propDefinition: [
        alttextify,
        "ecommerceProductName",
      ],
    },
    ecommerceProductBrand: {
      propDefinition: [
        alttextify,
        "ecommerceProductBrand",
      ],
    },
    ecommerceProductColor: {
      propDefinition: [
        alttextify,
        "ecommerceProductColor",
      ],
    },
    ecommerceProductSize: {
      propDefinition: [
        alttextify,
        "ecommerceProductSize",
      ],
    },
  },
  async run({ $ }) {
    const imagePath = checkTmp(this.image);
    const image = fs.readFileSync(imagePath, "base64");

    const response = await this.alttextify.uploadImage({
      $,
      data: {
        async: this.async,
        image: `data:image/${imagePath.split(".")[1]};base64,${image}`,
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
