import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import platerecognizer from "../../platerecognizer.app.mjs";

export default {
  key: "platerecognizer-run-recognition",
  name: "Run Recognition",
  description: "Triggers a recognition process using the Plate Recognizer SDK.",
  version: "0.0.1",
  type: "action",
  props: {
    platerecognizer,
    imageFileOrUrl: {
      type: "string",
      label: "Image File or URL",
      description: "The image file or URL to be recognized.",
    },
    regions: {
      type: "string[]",
      label: "Regions",
      description: "Regions to select specific license plate patterns. [See further details here](https://guides.platerecognizer.com/docs/other/country-codes/#country-codes)",
      optional: true,
    },
    cameraId: {
      type: "string",
      label: "Camera ID",
      description: "The ID of the camera that took the image.",
      optional: true,
    },
    mmc: {
      type: "boolean",
      label: "MMC",
      description: "Whether to detect vehicle make, model, and color.",
      optional: true,
    },
    config: {
      type: "object",
      label: "Config",
      description: "Additional configuration. [See further details here](https://guides.platerecognizer.com/docs/snapshot/api-reference/#engine-configuration)",
      optional: true,
    },
  },
  async run({ $ }) {
    const fileObj = {};

    if (this.imageFileOrUrl.startsWith("http")) {
      fileObj.upload_url = this.imageFileOrUrl;
    } else {
      const file = fs.readFileSync(checkTmp(this.imageFileOrUrl));
      fileObj.upload = Buffer(file).toString("base64");
    }

    const response = await this.platerecognizer.runRecognition({
      $,
      data: {
        ...fileObj,
        regions: this.regions,
        camera_id: this.cameraId,
        mmc: this.mmc,
        config: this.config,
      },
    });

    $.export("$summary", "Recognition process triggered successfully");
    return response;
  },
};
