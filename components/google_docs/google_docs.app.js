const { google } = require("googleapis");
const googleDrive = require("../google_drive/google_drive.app");

module.exports = {
  type: "app",
  app: "google_docs",
  propDefinitions: {
    ...googleDrive.propDefinitions,
    docId: {
      type: "string",
      label: "Document",
      description: "Select a document or disable structured mode to pass a value exported from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or to manually enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
      async options({
        prevContext, driveId,
      }) {
        const { nextPageToken } = prevContext;
        return this.listDocsOptions(driveId, nextPageToken);
      },
    },
  },
  methods: {
    ...googleDrive.methods,
    docs() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return google.docs({
        version: "v1",
        auth,
      });
    },
    async listDocsOptions(driveId, pageToken = null) {
      const q = "mimeType='application/vnd.google-apps.document'";
      let request = {
        q,
      };
      if (driveId) {
        request = {
          ...request,
          corpora: "drive",
          driveId,
          pageToken,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }
      return this.listFilesOptions(pageToken, request);
    },
  },
};
