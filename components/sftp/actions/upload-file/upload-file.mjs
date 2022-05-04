// legacy_hash_id: a_8Ki7G7
import Client from "ssh2-sftp-client";

export default {
  key: "sftp-upload-file",
  name: "Upload String as File",
  description: "Uploads a UTF-8 string as a file on an SFTP server",
  version: "0.1.1",
  type: "action",
  props: {
    sftp: {
      type: "app",
      app: "sftp",
    },
    data: {
      type: "string",
      description: "A UTF-8 string to upload as a file on the remote server.",
    },
    remotePath: {
      type: "string",
      label: "Remote Path",
      description: "The path to the remote file to be created on the server.",
    },
  },
  async run({ $ }) {
    const {
      host,
      username,
      privateKey,
    } = this.sftp.$auth;

    const config = {
      host,
      username,
      privateKey,
    };

    const sftp = new Client();

    await sftp.connect(config);
    $.export("putResponse", await sftp.put(Buffer.from(this.data), this.remotePath));
    await sftp.end();
  },
};
