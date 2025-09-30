import app from "../../podio.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "podio-upload-file",
  name: "Upload File",
  description: "Uploads a new file to Podio. [See the documentation](https://developers.podio.com/doc/files/upload-file-1004361)",
  version: "0.1.2",
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
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "File name of the uploaded file. If not specified, the original file name will be used.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
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
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const fileName = this.fileName || metadata.name;

    data.append("source", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: fileName,
    });
    data.append("filename", fileName);

    const response = await this.uploadFile({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully uploaded file");
    return response;
  },
};
