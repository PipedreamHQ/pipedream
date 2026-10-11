import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredHttpUrl } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-face-keypoints",
  name: "Analyze Face Keypoints",
  description: "Analyze keypoints in an authorized image. [See the documentation](https://platform.acedata.cloud/documents/face-analyze)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "Public HTTP or HTTPS image, e.g. `https://example.com/portrait.png`.",
    },
    mode: {
      type: "integer",
      label: "Mode",
      description: "Face selection: `0` for all faces or `1` for the largest, e.g. `1`.",
      default: 1,
    },
  },
  async run({ $ }) {
    if (![
      0,
      1,
    ].includes(this.mode)) {
      throw new Error("Mode must be 0 or 1.");
    }
    const data = {
      image_url: requiredHttpUrl(this.imageUrl, "Image URL"),
      mode: this.mode,
    };
    const response = await this.acedatacloud.request({
      $,
      path: "/face/analyze",
      data,
    });
    $.export("$summary", "Analyze Face Keypoints returned a response");
    return response;
  },
};
