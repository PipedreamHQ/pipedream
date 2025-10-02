import roboflow from "../../roboflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "roboflow-detect-object-from-image",
  name: "Detect Object From Image",
  description: "Run inference on your object detection models hosted on Roboflow. [See the documentation](https://docs.roboflow.com/deploy/hosted-api/object-detection).",
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
    const response = await this.roboflow.detectObject({
      datasetId: this.datasetId,
      $,
      data: await utils.getBase64File(this.filePath),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response?.error) {
      $.export("$summary", "Successfully ran object detection inference model on image.");
    }

    return response;
  },
};
