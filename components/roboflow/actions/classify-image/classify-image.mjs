import roboflow from "../../roboflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "roboflow-classify-image",
  name: "Classify Image",
  description: "Run inference on classification models hosted on Roboflow. [See the documentation](https://docs.roboflow.com/deploy/hosted-api/classification).",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    roboflow,
    projectId: {
      propDefinition: [
        roboflow,
        "projectId",
      ],
    },
    datasetId: {
      propDefinition: [
        roboflow,
        "datasetId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    filePath: {
      propDefinition: [
        roboflow,
        "filePath",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.roboflow.classifyImage({
      datasetId: this.datasetId,
      $,
      data: await utils.getBase64File(this.filePath),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response?.error) {
      $.export("$summary", "Successfully classified image.");
    }

    return response;
  },
};
