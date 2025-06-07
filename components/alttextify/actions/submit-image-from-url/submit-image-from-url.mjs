import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-submit-image-from-url",
  name: "Submit Image from URL to Alttextify",
  description: "Upload or submit an image URL to Alttextify for alt text generation. [See the documentation](https://apidoc.alttextify.net/#api-Image-UploadImageURL)",
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
      label: "Image URL",
      description: "The URL of the image to upload.",
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
        "ecommerceProductSize",
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
    const response = await this.alttextify.uploadImageFromUrl({
      $,
      data: {
        async: this.async,
        image: this.image,
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
