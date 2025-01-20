import autodesk from "../../autodesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "autodesk-upload-file",
  name: "Upload File to Autodesk Project or Folder",
  description: "Uploads a new file to a specified project or folder in Autodesk. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    autodesk,
    projectId: {
      propDefinition: [
        autodesk,
        "projectId",
      ],
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file to upload",
    },
    fileContent: {
      type: "string",
      label: "File Content",
      description: "The content of the file to upload",
    },
    folderId: {
      propDefinition: [
        autodesk,
        "folderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    this.autodesk.projectId = this.projectId;
    this.autodesk.fileName = this.fileName;
    this.autodesk.fileContent = this.fileContent;
    if (this.folderId) {
      this.autodesk.folderId = this.folderId;
    }

    const response = await this.autodesk.uploadFile();

    $.export("$summary", `Uploaded file "${this.fileName}" to project "${this.projectId}"${this.folderId
      ? ` and folder "${this.folderId}"`
      : ""}.`);
    return response;
  },
};
