import roboflow from "../../roboflow.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import utils from "../../common/utils.mjs";
import FormData from "form-data";

export default {
  key: "roboflow-upload-image",
  name: "Upload Image",
  description: "Upload an image to a project on the Roboflow platform. [See the documentation](https://docs.roboflow.com/datasets/adding-data/upload-api).",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    if (this.name) {
      formData.append("name", this.name);
    }

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.roboflow.uploadImage({
      $,
      projectId: utils.extractSubstringAfterSlash(this.projectId),
      data: formData,
      headers: formData.getHeaders(),
    });

    if (!response?.error) {
      $.export("$summary", "Successfully uploaded image.");
    }

    return response;
  },
};
