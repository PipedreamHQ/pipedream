import app from "../../sftp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "sftp-upload-file",
  name: "Upload String as File",
  description: "Uploads a UTF-8 string as a file on an SFTP server",
  version: "0.1.2",
  type: "action",
  props: {
    app,
    privateKey: {
      type: "string",
      label: "Private Key",
      description: "Supported keys are `ecdsa`, `ed25519`, and `rsa`",
      secret: true,
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "A UTF-8 string to upload as a file on the remote server.",
    },
    remoteFilePath: {
      type: "string",
      label: "Remote File Path",
      description: "The path to the remote file to be created on the server.",
    },
  },
  methods: {
    put({
      input, remoteFilePath,
    } = {}) {
      return this.app.execCmd({
        privateKey: this.privateKey,
        cmd: constants.CMD.PUT,
        args: [
          input,
          remoteFilePath,
        ],
      });
    },
  },
  async run({ $: step }) {
    const {
      data,
      remoteFilePath,
    } = this;

    const response =
      await this.put({
        input: Buffer.from(data),
        remoteFilePath,
      });

    step.export("$summary", "File uploaded successfully");

    return response;
  },
};
