module.exports = {
  type: "app",
  app: "google_cloud",
  methods: {
    sdkParams() {
      const { project_id, client_email, private_key } = JSON.parse(this.$auth.key_json);
      const credentials = {
        client_email,
        private_key,
      };
      return {
        credentials,
        projectId: project_id,
      };
    },
  },
};
