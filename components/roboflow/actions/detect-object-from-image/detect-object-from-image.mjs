import roboflow from "../../roboflow.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "roboflow-detect-object-from-image",
  name: "Detect Object From Image",
  description: "Run inference on your object detection models hosted on Roboflow. [See the documentation](https://docs.roboflow.com/deploy/hosted-api/object-detection).",
  version: "0.0.1",
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
    fileUrl: {
      propDefinition: [
        roboflow,
        "fileUrl",
      ],
    },
  },
  async run({ $ }) {
    if ((!this.filePath && !this.fileUrl) || (this.filePath && this.fileUrl)) {
      throw new ConfigurationError("Exactly one of file Path or File URL must be specified.");
    }

    const args = {
      datasetId: this.datasetId,
      $,
    };

    if (this.filePath) {
      args.data = fs.readFileSync(this.filePath, {
        encoding: "base64",
      });
      args.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    }
    if (this.fileUrl) {
      args.params = {
        image: this.fileUrl,
      };
    }

    const response = await this.roboflow.detectObject(args);

    if (!response?.error) {
      $.export("$summary", "Successfully ran object detection inference model on image.");
    }

    return response;
  },
};
