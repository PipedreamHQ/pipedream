import {
  BACKGROUND_COLOR_OPTIONS, CROP_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import { getUrlOrFile } from "../../common/utils.mjs";
import deepimage from "../../deepimage.app.mjs";

export default {
  key: "deepimage-remove-background",
  name: "Remove Background",
  description: "Removes the background from the provided image using DeepImage. [See the documentation](https://documentation.deep-image.ai/image-processing/background-processing)",
  version: "0.1.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deepimage,
    image: {
      propDefinition: [
        deepimage,
        "image",
      ],
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "The background color for the image.",
      options: BACKGROUND_COLOR_OPTIONS,
    },
    cropType: {
      type: "string",
      label: "Crop Type",
      description: "The crop type for background removal.",
      optional: true,
      options: CROP_TYPE_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.deepimage.makeRequest({
      $,
      data: {
        url: await getUrlOrFile(this.image),
        background: {
          remove: "auto",
          color: this.backgroundColor,
        },
        fit: this.cropType
          ? {
            crop: this.cropType,
          }
          : {},
      },
    });

    $.export("$summary", "Background removal successful");
    return response;
  },
};
