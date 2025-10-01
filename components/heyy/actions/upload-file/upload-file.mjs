import { createReadStream } from "fs";
import FormData from "form-data";
import app from "../../heyy.app.mjs";

export default {
  key: "heyy-upload-file",
  name: "Upload File",
  description: "Uploads a file. [See the documentation](https://documenter.getpostman.com/view/27408936/2sA2r3a6DW#67e41b81-318c-4ed0-be78-e92fd39f3530).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The file to be uploaded, please provide a file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the file to be uploaded.",
      options: [
        "IMAGE",
        "VIDEO",
        "DOCUMENT",
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
    uploadFile(args = {}) {
      return this.app.post({
        path: "/upload_file",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadFile,
      filePath,
      format,
    } = this;

    const file = filePath.startsWith("/tmp")
      ? filePath
      : `/tmp/${filePath}`;

    const data = new FormData();
    data.append("file", createReadStream(file));
    data.append("format", format);

    const response = await uploadFile({
      $,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
    $.export("$summary", `Succesfully uploaded file with ID \`${response.id}\`.`);
    return response;
  },
};
