import FormData from "form-data";
import urlExists from "url-exist";
import claidAi from "../../claid_ai.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "claid_ai-remove-background",
  name: "Remove Background",
  description: "Easily erases the image's background, effectively isolating the main subject. [See the documentation](https://docs.claid.ai/image-editing-api/image-operations/background)",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    claidAi,
    image: {
      propDefinition: [
        claidAi,
        "image",
      ],
    },
    category: {
      type: "string",
      label: "Category",
      description: "Provides a hint about the nature of object in the foreground for a more accurate result of background removal.",
      options: [
        "general",
        "products",
        "cars",
      ],
      reloadProps: true,
      optional: true,
    },
    removeBackground: {
      type: "boolean",
      label: "Remove Background",
      description: "Removes image background.",
      default: true,
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.removeBackground) {
      props.clipping = {
        type: "boolean",
        label: "Clipping",
        description: "If **true**, image is clipped to the foreground object bounds.",
        default: false,
      };
      props.color = {
        type: "string",
        label: "Background Color",
        description: "The image background. You can set **transparent** or any color in hexadecimal format.",
        default: "transparent",
      };
    } else {
      props.type = {
        type: "string",
        label: "Blur Type",
        description: "Type of blur to be applied to the background.",
        options: [
          "regular",
          "lens",
        ],
      };
      props.level = {
        type: "string",
        label: "Level",
        description: "The level of blur strength to be applied to the background.",
        options: [
          "low",
          "medium",
          "high",
        ],
      };
    }
    return props;
  },
  async run({ $ }) {
    let imageUrl = this.image;
    let response = "";

    const operations = {
      background: this.removeBackground
        ? {
          remove: {
            category: this.category,
            clipping: this.clipping,
          },
          color: this.color,
        }
        : {
          blur: {
            category: this.category,
            clipping: this.clipping,
          },
        },
    };

    if (!await urlExists(this.image)) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.image);
      const formData = new FormData();
      formData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
      formData.append("data", JSON.stringify({
        operations,
      }));

      response = await this.claidAi.uploadImage({
        $,
        data: formData,
        headers: formData.getHeaders(),
      });
    } else {
      response = await this.claidAi.editImage({
        $,
        data: {
          input: imageUrl,
          operations,
          output: {
            format: "png",
          },
        },
      });
    }

    $.export("$summary", "Successfully removed the background from the image");
    return response;
  },
};
