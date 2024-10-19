import { ConfigurationError } from "@pipedream/platform";
import app from "../../file_store.app.mjs";

export default {
  key: "file_store-upload-file",
  name: "Upload File",
  description: "Uploads a file to the File Store. [See the documentation](https://pipedream.com/docs/projects/file-stores/reference/#file-fromfile-localfilepath-contenttype)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    filePath: {
      propDefinition: [
        app,
        "filePath",
      ],
      description: "The destination file path to upload to.",
    },
    localFilePath: {
      type: "string",
      label: "Local File Path",
      description: "The path to a file in the `/tmp` directory to upload to the File Store. You should specify either a Local File Path or a File URL.",
      optional: true,
    },
    url: {
      type: "string",
      label: "File URL",
      description: "The URL to a file to upload to the File Store. You should specify either a File URL or a Local File Path.",
      optional: true,
    },
  },
  async run({ $ }) {
    const file = await $.files.open(this.filePath);

    let response;

    if (this.url) {
      response = await file.fromUrl(this.url);
    } else if (this.localFilePath) {
      response = await file.fromFile(this.localFilePath.includes("tmp/")
        ? this.localFilePath
        : `/tmp/${this.localFilePath}`);
    } else {
      throw new ConfigurationError("You must provide either a Local File Path or a File URL.");
    }

    $.export("$summary", `Successfully uploaded file to "${this.filePath}"`);
    return response;
  },
};
