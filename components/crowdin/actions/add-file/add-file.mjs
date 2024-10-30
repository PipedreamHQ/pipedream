import { TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import crowdin from "../../crowdin.app.mjs";

export default {
  key: "crowdin-add-file",
  name: "Add File to Project",
  description: "Adds a file into the created project. [See the documentation](https://developer.crowdin.com/api/v2/#tag/source-files/operation/api.projects.files.post)",
  version: "0.0.1",
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
      description: "The name of the file in Crowdin. **Note:** Can't contain `\\ / : * ? \" < > |` symbols. `ZIP` files are not allowed.",
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
      description: "Use to provide more details for translators. Title is available in UI only",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "Use to provide context about whole file",
      optional: true,
    },
    type: {
      type: "string",
      label: "File Type",
      description: "The type of the file. **Note:** Use `docx` type to import each cell as a separate source string for XLSX file. Default is `auto`",
      options: TYPE_OPTIONS,
      optional: true,
    },
    parserVersion: {
      type: "integer",
      label: "Parser Version",
      description: "Using latest parser version by default. **Note:** Must be used together with `type`.",
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
    const {
      crowdin,
      attachLabelIds,
      projectId,
      ...data
    } = this;

    const response = await crowdin.uploadFileToProject({
      $,
      projectId,
      data: {
        ...data,
        attachLabelIds: parseObject(attachLabelIds),
      },
    });
    $.export("$summary", `Successfully uploaded file: ${this.name}`);
    return response;
  },
};
