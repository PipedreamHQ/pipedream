import Client from "ssh2-sftp-client";

export default {
  type: "app",
  app: "sftp_password_based_auth",
  propDefinitions: {},
  methods: {
    async connect() {
      const {
        host,
        username,
        password,
      } = this.$auth;

      const config = {
        host,
        username,
        password,
      };

      const sftp = new Client();
      await sftp.connect(config);
      return sftp;
    },
  },
};
