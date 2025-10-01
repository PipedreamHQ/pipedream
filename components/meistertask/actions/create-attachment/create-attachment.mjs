import meistertask from "../../meistertask.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "meistertask-create-attachment",
  name: "Create Attachment",
  description: "Create a new attachment. [See the docs](https://developers.meistertask.com/reference/post-attachment)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
      optional: true,
    },
    sectionId: {
      propDefinition: [
        meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        meistertask,
        "taskId",
        (c) => ({
          projectId: c.projectId,
          sectionId: c.sectionId,
        }),
      ],
    },
    filepath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the attachment",
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
    const {
      taskId,
      filepath,
      name,
    } = this;

    const data = new FormData();

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filepath);
    data.append("local", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    if (name) {
      data.append("name", name);
    }
    const headers = {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    };

    const response = await this.meistertask.createAttachment({
      $,
      taskId,
      data,
      headers,
    });
    $.export("$summary", `Successfully created attachment with ID ${response.id}.`);
    return response;
  },
};
