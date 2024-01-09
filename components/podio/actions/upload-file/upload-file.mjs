import app from "../../podio.app.mjs";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "podio-upload-file",
  name: "Upload File",
  description: "Uploads a new file to Podio. [See the documentation](https://developers.podio.com/doc/files/upload-file-1004361)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "File name of the uploaded file. If not specified, the original file name will be used.",
      optional: true,
    },
  },
  methods: {
    uploadFile(args) {
      return this.app._makeRequest({
        path: "/file/",
        method: "POST",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const data = new FormData();

    const {
      filePath, fileName,
    } = this;

    const content = fs.createReadStream(filePath.includes("tmp/")
      ? filePath
      : `/tmp/${filePath}`);

    data.append("source", content);
    data.append("filename", fileName ?? this.filePath.split("/").pop());

    const response = await this.uploadFile({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully uploaded file");
    return response;
  },
};
