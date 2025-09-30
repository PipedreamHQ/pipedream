import { getFileStream } from "@pipedream/platform";
import app from "../../happy_scribe.app.mjs";

export default {
  name: "Submit File",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "happy_scribe-submit-file",
  description: "Submit a file. [See the documentation](https://dev.happyscribe.com/sections/product/#uploads-2-upload-your-file-with-the-signed-url)",
  type: "action",
  props: {
    app,
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename of the file you want to upload",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = await getFileStream(this.filePath);
    const response = await this.app.uploadFile({
      $,
      filename: this.filename,
      data,
    });

    $.export("$summary", `Successfully uploaded file from ${this.filePath}`);

    return response;
  },
};
