// legacy_hash_id: a_YEikdQ
import Client from "ssh2-sftp-client";

export default {
  key: "sftp_password_based_auth-upload-file",
  name: "Upload String as File",
  description: "Uploads a UTF-8 string as a file on an SFTP server",
  version: "0.1.1",
  type: "action",
  props: {
    sftp_password_based_auth: {
      type: "app",
      app: "sftp_password_based_auth",
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
      password,
    } = this.sftp_password_based_auth.$auth;

    const config = {
      host,
      username,
      password,
    };

    const sftp = new Client();

    await sftp.connect(config);
    $.export("putResponse", await sftp.put(Buffer.from(this.data), this.remotePath));
    await sftp.end();
  },
};
