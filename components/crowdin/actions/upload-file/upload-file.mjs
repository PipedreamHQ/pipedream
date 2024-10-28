import crowdin from "../../crowdin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crowdin-upload-file",
  name: "Upload File to Project",
  description: "Uploads a file into the created project. [See the documentation](https://developer.crowdin.com/api/v2/#tag/source-files/operation/api.projects.files.post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    crowdin,
    projectId: {
      propDefinition: [
        crowdin,
        "projectId",
      ],
    },
    storageId: {
      propDefinition: [
        crowdin,
        "storageId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the file in Crowdin",
    },
    branchId: {
      propDefinition: [
        crowdin,
        "branchId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    directoryId: {
      propDefinition: [
        crowdin,
        "directoryId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the file",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "The context of the file",
      optional: true,
    },
    type: {
      type: "string",
      label: "File Type",
      description: "The type of the file",
      optional: true,
    },
    parserVersion: {
      type: "integer",
      label: "Parser Version",
      description: "The version of the parser",
      optional: true,
    },
    attachLabelIds: {
      propDefinition: [
        crowdin,
        "attachLabelIds",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const params = {
      projectId: this.projectId,
      storageId: this.storageId,
      name: this.name,
      branchId: this.branchId,
      directoryId: this.directoryId,
      title: this.title,
      context: this.context,
      type: this.type,
      parserVersion: this.parserVersion,
      attachLabelIds: this.attachLabelIds,
    };

    const data = Object.fromEntries(Object.entries(params).filter(([
      , v,
    ]) => v !== undefined && v !== ""));

    const response = await this.crowdin.uploadFileToProject(data);
    $.export("$summary", `Successfully uploaded file: ${this.name}`);
    return response;
  },
};
