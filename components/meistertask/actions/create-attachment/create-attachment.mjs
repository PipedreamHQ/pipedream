import meistertask from "../../meistertask.app.mjs";
import FormData from "form-data";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "meistertask-create-attachment",
  name: "Create Attachment",
  description: "Create a new attachment. [See the docs](https://developers.meistertask.com/reference/post-attachment)",
  version: "0.0.1",
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
      label: "File Path",
      description: "Path of the file in /tmp folder to add as an attachment. To upload a file to /tmp folder, please follow the [doc here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the attachment",
      optional: true,
    },
  },
  methods: {
    checkTmp(filename) {
      if (filename.indexOf("/tmp") === -1) {
        return `/tmp/${filename}`;
      }
      return filename;
    },
  },
  async run({ $ }) {
    const {
      taskId,
      filepath,
      name,
    } = this;

    const data = new FormData();
    const path = this.checkTmp(filepath);

    if (!fs.existsSync(path)) {
      throw new ConfigurationError("File does not exist");
    }

    const file = fs.createReadStream(path);
    const stats = fs.statSync(path);
    data.append("local", file, {
      knownLength: stats.size,
    });
    if (name) {
      data.append("name", name);
    }
    const headers = {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    };

    const response = await this.meistertask.createAttachment({
      taskId,
      data,
      headers,
    });
    $.export("$summary", `Successfully created attachment with ID ${response.id}.`);
    return response;
  },
};
