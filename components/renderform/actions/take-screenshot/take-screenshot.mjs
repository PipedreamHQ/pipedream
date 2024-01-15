import renderform from "../../renderform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "renderform-take-screenshot",
  name: "Take Screenshot",
  description: "Capture an image of the current screen. [See the documentation](https://renderform.io/docs/api/take-screenshots)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    renderform,
    screenCoordinates: {
      propDefinition: [
        renderform,
        "screenCoordinates",
      ],
    },
    imageFormat: {
      propDefinition: [
        renderform,
        "imageFormat",
        (c) => ({
          default: c.imageFormat
            ? c.imageFormat
            : "png",
        }),
      ],
      optional: true,
    },
    imageQuality: {
      propDefinition: [
        renderform,
        "imageQuality",
        (c) => ({
          default: c.imageQuality
            ? c.imageQuality
            : 100,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.renderform.captureImage({
      screenCoordinates: this.screenCoordinates,
      imageFormat: this.imageFormat,
      imageQuality: this.imageQuality,
    });

    $.export("$summary", `Captured a screenshot in format ${this.imageFormat}`);
    return response;
  },
};
