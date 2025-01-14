import egnyte from "../../egnyte.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "egnyte-upload-file",
  name: "Upload File",
  description: "Uploads a file to a specified folder in Egnyte. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    egnyte,
    uploadFileContent: {
      propDefinition: [
        egnyte,
        "uploadFileContent",
      ],
    },
    uploadFolderId: {
      propDefinition: [
        egnyte,
        "uploadFolderId",
      ],
    },
    uploadFileName: {
      propDefinition: [
        egnyte,
        "uploadFileName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.egnyte.uploadFile({
      fileContent: this.uploadFileContent,
      uploadFolderId: this.uploadFolderId,
      fileName: this.uploadFileName,
    });
    $.export("$summary", `Uploaded file ${this.uploadFileName || "uploaded_file"} to folder ID ${this.uploadFolderId}`);
    return response;
  },
};
