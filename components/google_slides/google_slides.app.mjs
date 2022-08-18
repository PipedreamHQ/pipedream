import slides from "@googleapis/slides";
import googleDrive from "../google_drive/google_drive.app.mjs";

export default {
  ...googleDrive,
  type: "app",
  app: "google_slides",
  propDefinitions: {
    ...googleDrive.propDefinitions,
    presentationId: {
      type: "string",
      label: "Presentation",
      description: "The Presentation ID",
      options({
        prevContext,
        driveId,
      }) {
        const { nextPageToken } = prevContext;
        return this.listPresentationsOptions(driveId, nextPageToken);
      },
    },
  },
  methods: {
    ...googleDrive.methods,
    slides() {
      const auth = new slides.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return slides.slides({
        version: "v1",
        auth,
      });
    },
    refreshChart(presentationId, chartId) {
      const slides = this.slides();
      const requests = [
        {
          refreshSheetsChart: {
            objectId: chartId,
          },
        },
      ];
      return slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests,
        },
      });
    },
    async createPresentation(title) {
      const slides = this.slides();
      const presentation = await slides.presentations.create({
        title,
      });
      return presentation.data;
    },
    async listPresentationsOptions(driveId, pageToken = null) {
      const q = "mimeType='application/vnd.google-apps.presentation'";
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
    async getPresentation(presentationId) {
      const slides = this.slides();
      const request = {
        presentationId,
      };
      return (await slides.presentations.get(request)).data;
    },
    async copyPresentation(fileId, name) {
      const drive = this.drive();
      const resource = {
        name,
      };
      return (
        await drive.files.copy({
          fileId,
          fields: "*",
          supportsAllDrives: true,
          resource,
        })
      ).data;
    },
  },
};
