import sftpApp from "@pipedream/sftp";

export default {
  ...sftpApp,
  type: "app",
  app: "sftp_password_based_auth",
  methods: {
    ...sftpApp.methods,
    getConfig() {
      const {
        host,
        username,
        password,
      } = this.$auth;

      return {
        host,
        username,
        password,
      };
    },
  },
};
