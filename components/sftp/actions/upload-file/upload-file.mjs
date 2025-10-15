import app from "../../sftp.app.mjs";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";

export default {
  key: "sftp-upload-file",
  name: "Upload File",
  description: "Uploads a file or string in UTF-8 format to the SFTP server. [See the documentation](https://github.com/theophilusx/ssh2-sftp-client#org99d1b64)",
  version: "0.4.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    file: {
      propDefinition: [
        app,
        "file",
      ],
    },
    data: {
      type: "string",
      label: "Data",
      description: "Upload a string in UTF-8 format to the remote server.",
      optional: true,
    },
    remotePath: {
      type: "string",
      label: "Remote Path",
      description: "The path on the sftp server for store the data. e.g. `./uploads/my-file.txt`",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.data && !this.file) {
      throw new ConfigurationError("Either `Data` or `File Path or URL` must be provided.");
    }

    const buffer = this.file ?
      (await getFileStream(this.file)) :
      Buffer.from(this.data);

    const response = await this.app.put({
      buffer: buffer,
      remotePath: this.remotePath,
    });

    $.export("$summary", "Successfully uploaded data stream");
    return response;
  },
};
