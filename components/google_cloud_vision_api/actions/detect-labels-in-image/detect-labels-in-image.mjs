import common from "../common/base.mjs";

export default {
  ...common,
  name: "Detect Labels in Image",
  key: "google_cloud_vision_api-detect-labels-in-image",
  description: "Performs feature detection on a local or remote image file. [See the documentation](https://cloud.google.com/vision/docs/labels).",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "An integer value of results to return. If omitted the API returns the default value of 10 results.",
      default: 10,
      optional: true,
    },
  },
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
                maxResults: this.maxResults,
                type: "LABEL_DETECTION",
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", "Successfully detected labels in image.");
    return response;
  },
};
