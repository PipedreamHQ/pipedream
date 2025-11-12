import { TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import crowdin from "../../crowdin.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "crowdin-add-file",
  name: "Add File to Project",
  description: "Adds a file into the created project. [See the documentation](https://developer.crowdin.com/api/v2/#tag/source-files/operation/api.projects.files.post)",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    crowdin,
    projectId: {
      propDefinition: [
        crowdin,
        "projectId",
      ],
    },
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.jpg`)",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const {
      crowdin,
      attachLabelIds,
      projectId,
      file,
      ...data
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);
    const fileBinary = await this.streamToBuffer(stream);

    const crowdinFilename = file.startsWith("/tmp/")
      ? file.slice(5)
      : file;

    const fileResponse = await crowdin.createStorage({
      data: Buffer.from(fileBinary, "binary"),
      headers: {
        "Crowdin-API-FileName": encodeURI(crowdinFilename),
        "Content-Type": metadata.contentType || "application/octet-stream",
      },
    });

    const response = await crowdin.uploadFileToProject({
      $,
      projectId,
      data: {
        ...data,
        storageId: fileResponse.data.id,
        attachLabelIds: parseObject(attachLabelIds),
      },
    });
    $.export("$summary", `Successfully uploaded file: ${this.name}`);
    return response;
  },
};
