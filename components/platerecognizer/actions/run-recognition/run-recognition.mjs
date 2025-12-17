import { getFileStream } from "@pipedream/platform";
import platerecognizer from "../../platerecognizer.app.mjs";

export default {
  key: "platerecognizer-run-recognition",
  name: "Run Recognition",
  description: "Triggers a recognition process using the Plate Recognizer SDK.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    platerecognizer,
    imageFileOrUrl: {
      type: "string",
      label: "Image Path or URL",
      description: "The image to be recognized. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myImage.jpg`)",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {

    const stream = await getFileStream(this.imageFileOrUrl);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const response = await this.platerecognizer.runRecognition({
      $,
      data: {
        upload: buffer.toString("base64"),
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
