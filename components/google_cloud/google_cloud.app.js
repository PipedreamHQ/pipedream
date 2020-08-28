module.exports = {
  type: "app",
  app: "google_cloud",
  methods: {
    sdkParams() {
      const { projectId, clientEmail, privateKey } = this.$auth;
      const credentials = {
        client_email: clientEmail,
        private_key: privateKey,
      };
      return {
        credentials,
        projectId,
      };
    },
  },
};
