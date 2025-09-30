import common from "../common/base.mjs";

export default {
  ...common,
  name: "Detect Text in Image",
  key: "google_cloud_vision_api-detect-text-in-image",
  description: "Detects text in a local image or remote image. [See the documentation](https://cloud.google.com/vision/docs/ocr#vision_text_detection_gcs-drest).",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", "Successfully detected text in image.");
    return response;
  },
};
