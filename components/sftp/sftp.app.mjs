import Client from "ssh2-sftp-client";
import fs from "fs";

export default {
  type: "app",
  app: "sftp",
  propDefinitions: {
    file: {
      type: "string",
      label: "File",
      description: "Local file on `/tmp` folder to upload to the remote server.",
      optional: true,
      options() {
        return fs.readdirSync("/tmp", {
          withFileTypes: true,
        })
          .filter((file) => !file.isDirectory())
          .map((file) => file.name);
      },
    },
  },
  methods: {
    async connect() {
      const {
        host,
        username,
        privateKey,
      } = this.$auth;

      const config = {
        host,
        username,
        privateKey,
      };

      const sftp = new Client();
      await sftp.connect(config);
      return sftp;
    },
    async put({
      buffer,
      remotePath,
    }) {
      const sftp = await this.connect();
      const response = await sftp.put(buffer, remotePath);
      await sftp.end();
      return response;
    },
  },
};
