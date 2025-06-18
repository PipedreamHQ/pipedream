import Client from "ssh2-sftp-client";

export default {
  type: "app",
  app: "sftp",
  propDefinitions: {
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`).",
      optional: true,
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
