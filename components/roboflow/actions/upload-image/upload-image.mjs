import roboflow from "../../roboflow.app.mjs";
import { getFileStream } from "@pipedream/platform";
import utils from "../../common/utils.mjs";
import FormData from "form-data";

export default {
  key: "roboflow-upload-image",
  name: "Upload Image",
  description: "Upload an image to a project on the Roboflow platform. [See the documentation](https://docs.roboflow.com/datasets/adding-data/upload-api).",
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
    filePath: {
      propDefinition: [
        roboflow,
        "filePath",
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
    const args = {
      projectId: utils.extractSubstringAfterSlash(this.projectId),
      $,
    };

    const formData = new FormData();
    if (this.name) {
      formData.append("name", this.name);
    }

    if (this.filePath.startsWith("http")) {
      args.params = {
        image: this.filePath,
        name: this.name,
      };
    } else {
      const stream = getFileStream(this.filePath);
      formData.append("file", stream);
      args.data = formData;
      args.headers = formData.getHeaders();
    }

    const response = await this.roboflow.uploadImage(args);

    if (!response?.error) {
      $.export("$summary", "Successfully uploaded image.");
    }

    return response;
  },
};
