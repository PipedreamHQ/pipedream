import alttextify from "../../alttextify.app.mjs";
import { LANGUAGE_LIST } from "../../common/constants.mjs";

export default {
  name: "Generate Alt Text",
  key: "alttextify-generate-alt-text",
  description: "Generates a descriptive alt text for a given image. [See the documentation](https://apidoc.alttextify.net/#api-Image-UploadImageURL)",
  version: "0.0.2",
  type: "action",
  props: {
    alttextify,
    image: {
      type: "string",
      label: "Image URL",
      description:
        "Provide a publicly accessible image URL in JPEG, PNG, GIF, WEBP, or BMP format.",
      optional: false,
    },
    lang: {
      type: "string",
      label: "The language for the generated alt text.",
      description: "Provide a language code for the alt text output. Defaults to English (en). Accepts ISO 639-1 codes such as pt (Portuguese), de (German), etc.",
      options: LANGUAGE_LIST,
      default: "en",
      optional: true,
    },
    keywords: {
      type: "string",
      label: "SEO Keywords",
      description: "List of keywords/phrases for SEO optimized alt text. Only one or two will be used per alt text, but all are considered. Keywords must be in English, even for alt text in other languages.",
      default: "",
      optional: true,
    },
    product_name: {
      type: "string",
      label: "Product Name [Ecommerce]",
      description: "Product name to be included in the final Alt Text.",
      default: "",
      optional: true,
    },
    brand_name: {
      type: "string",
      label: "Brand Name [Ecommerce]",
      description: "Brand name to be included in the final Alt Text.",
      default: "",
      optional: true,
    }
  },
  async run({ $ }) {
    const response = await this.alttextify.generateAltText({
      $,
      data: {
        image: this.image,
        keywords: this.keywords,
        lang: this.lang,
        ecommerce: {
          product:{
            name: this.product_name,
            brand: this.brand_name,
          }
        },
        async: false
      },
    });
    console.log(response);

    $.export("$summary", "Alt text generated successfully");
    return response;
  },
};
