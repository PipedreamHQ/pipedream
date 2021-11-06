/* eslint-disable camelcase */
import { Logging } from "@google-cloud/logging";

export default {
  type: "app",
  app: "google_cloud",
  methods: {
    authKeyJson() {
      return JSON.parse(this.$auth.key_json);
    },
    sdkParams() {
      const {
        project_id: projectId,
        client_email,
        private_key,
      } = this.authKeyJson();
      const credentials = {
        client_email,
        private_key,
      };
      return {
        credentials,
        projectId,
      };
    },
    loggingClient() {
      return new Logging(this.sdkParams());
    },
  },
};
