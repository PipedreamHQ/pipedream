import roboflow from "../../roboflow.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "roboflow-upload-image",
  name: "Upload Image",
  description: "Upload an image to a project on the Roboflow platform. [See the documentation](https://docs.roboflow.com/datasets/adding-data/upload-api).",
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
    name: {
      type: "string",
      label: "Name",
      description: "Name of the uploaded file",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.filePath && !this.fileUrl) || (this.filePath && this.fileUrl)) {
      throw new ConfigurationError("Exactly one of file Path or File URL must be specified.");
    }

    const args = {
      projectId: utils.extractSubstringAfterSlash(this.projectId),
      $,
    };

    if (this.filePath) {
      const formData = new FormData();
      if (this.name) {
        formData.append("name", this.name);
      }
      formData.append("file", fs.createReadStream(this.filePath));

      args.data = formData;
      args.headers = formData.getHeaders();
    }

    if (this.fileUrl) {
      const params = {
        image: this.fileUrl,
        name: this.name,
      };

      args.params = params;
    }

    const response = await this.roboflow.uploadImage(args);

    if (!response?.error) {
      $.export("$summary", "Successfully uploaded image.");
    }

    return response;
  },
};
