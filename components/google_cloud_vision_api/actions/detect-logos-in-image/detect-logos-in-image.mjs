import common from "../common/base.mjs";

export default {
  ...common,
  name: "Detect Logos in Image",
  key: "google_cloud_vision_api-detect-logos-in-image",
  description: "Detects logos within a local or remote image file. [See the documentation](https://cloud.google.com/vision/docs/detecting-logos).",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    this.checkFileProp();
    const response = await this.googleCloudVision.detectDataInImage({
      $,
      data: {
        requests: [
          {
            image: {
              content: await this.getFileContent(),
            },
            features: [
              {
                "type": "LOGO_DETECTION",
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", "Successfully detected logos in image.");
    return response;
  },
};
