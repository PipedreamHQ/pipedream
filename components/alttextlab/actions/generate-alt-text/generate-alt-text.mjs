import altTextLab from "../../alttextlab.app.mjs";
import { AI_WRITING_STYLE } from "../../common/constants.mjs";

export default {
  key: "alttextlab-generate-alt-text",
  name: "Generate Alt Text",
  description: "Generates alt text for images using AI. [See the documentation](https://www.alttextlab.com/docs/api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    altTextLab,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Supported formats: PNG, JPG, WebP, AVIF, SVG",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "Provide the direct URL to the image you want to generate alt text for. Make sure the link is publicly accessible (not behind a login or firewall).",
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Enter the language code for the alt text generation (e.g., \"en\" for English, \"fr\" for French). See the [full list of supported languages](https://www.alttextlab.com/docs/api#language)",
      default: "en",
    },
    style: {
      type: "string",
      label: "AI writing styles",
      options: AI_WRITING_STYLE,
      description: "Alt-text writing styles define the tone, structure, and level of detail used to describe an image. [Learn more](https://www.alttextlab.com/docs/writing-style)",
      default: "neutral",
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Enter one or more keywords to alt text generation. Separate multiple keywords with commas. Example: cat, window, sunset.",
      optional: true,
    },
    ecommerceProduct: {
      type: "string",
      label: "Ecommerce Product Name",
      description: "The name of the product.",
      optional: true,
    },
    ecommerceBrand: {
      type: "string",
      label: "Ecommerce Product Brand",
      description: "The brand of the product.",
      optional: true,
    },
    ecommerceColor: {
      type: "string",
      label: "Ecommerce Product Color",
      description: "The color of the product.",
      optional: true,
    },
    ecommerceMaterial: {
      type: "string",
      label: "Ecommerce Product Material",
      description: "The material of the product.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.altTextLab.altTextGeneration({
      $,
      data: {
        source: "pipedream",
        imageUrl: this.imageUrl,
        lang: this.lang,
        style: this.style,
        keywords: this.keywords,
        ecommerce: {
          product: this.ecommerceProduct,
          brand: this.ecommerceBrand,
          color: this.ecommerceColor,
          material: this.ecommerceMaterial,
        },
      },
    });

    $.export("$summary", "Alt text has been generated");
    return response;
  },
};
