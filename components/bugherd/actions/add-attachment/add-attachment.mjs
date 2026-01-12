import { getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../bugherd.app.mjs";

export default {
  key: "bugherd-add-attachment",
  name: "Add Attachment",
  description: "Adds a new attachment to the specified task using an existing URL. [See the documentation](https://www.bugherd.com/api_v2#api_attachment_create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file",
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
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const fileBinary = await this.streamToBuffer(stream);

    const response = await this.app.uploadAttachment({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
      params: {
        file_name: this.fileName,
      },
      headers: {
        "Content-Type": metadata.contentType || "application/octet-stream",
      },
      data: Buffer.from(fileBinary, "binary"),
    });

    $.export("$summary", `Successfully added attachment "${this.fileName}" to task ${this.taskId}`);
    return response;
  },
};

