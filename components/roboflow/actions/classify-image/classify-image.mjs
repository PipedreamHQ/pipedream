import roboflow from "../../roboflow.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "roboflow-classify-image",
  name: "Classify Image",
  description: "Run inference on classification models hosted on Roboflow. [See the documentation](https://docs.roboflow.com/deploy/hosted-api/classification).",
  version: "0.1.0",
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
  },
  async run({ $ }) {
    const stream = getFileStream(this.filePath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks).toString("base64");

    const args = {
      datasetId: this.datasetId,
      $,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await this.roboflow.classifyImage(args);

    if (!response?.error) {
      $.export("$summary", "Successfully classified image.");
    }

    return response;
  },
};
