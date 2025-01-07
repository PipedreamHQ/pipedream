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
    getConfig() {
      const {
        host,
        username,
        privateKey,
      } = this.$auth;

      return {
        host,
        username,
        privateKey,
      };
    },
    async connect() {
      const sftp = new Client();
      await sftp.connect(this.getConfig());
      return sftp;
    },
    async disconnect(sftp) {
      await sftp.end();
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
