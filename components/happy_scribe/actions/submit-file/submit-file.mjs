import fs from "fs";
import app from "../../happy_scribe.app.mjs";

export default {
  name: "Submit File",
  version: "0.0.1",
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
      label: "File Path",
      description: "The path of the file you want to upload. E.g. `/tmp/filename.aac`",
    },
  },
  async run({ $ }) {
    const response = await this.app.uploadFile({
      $,
      filename: this.filename,
      data: fs.readFileSync(this.filePath),
    });

    $.export("$summary", `Successfully uploaded file from ${this.filePath}`);

    return response;
  },
};
