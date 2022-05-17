import Client from "ssh2-sftp-client";

export default {
  type: "app",
  app: "sftp",
  propDefinitions: {},
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
  },
};
