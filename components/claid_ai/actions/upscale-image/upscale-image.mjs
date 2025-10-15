import FormData from "form-data";
import urlExists from "url-exist";
import claidAi from "../../claid_ai.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "claid_ai-upscale-image",
  name: "Upscale Image",
  description: "Enlarges the selected image in order to improve its resolution. By running this action, users can obtain clearer and sharper images. [See the documentation](https://docs.claid.ai/image-editing-api/image-operations/resizing)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
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
    upscaleType: {
      type: "string",
      label: "Upscale Type",
      description: "The behavior of the upscale.",
      options: [
        "pixel",
        "percentage",
      ],
    },
    upscaleHeight: {
      type: "integer",
      label: "Upscale Height",
      description: "The quantity of pixels or percentage.",
    },
    upscaleWidth: {
      type: "integer",
      label: "Upscale Width",
      description: "The quantity of pixels or percentage.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    let imageUrl = this.image;
    let response = "";

    const upscaleHeight = this.upscaleType === "pixel"
      ? this.upscaleHeight
      : `${this.upscaleHeight}%`;
    const upscaleWidth = this.upscaleType === "pixel"
      ? this.upscaleWidth
      : `${this.upscaleWidth}%`;

    const operations = {
      resizing: {
        width: upscaleWidth,
        height: upscaleHeight,
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
        },
      });
    }

    $.export("$summary", "Image successfully upscaled");
    return response;
  },
};
