import slides from "@googleapis/slides";
import googleDrive from "@pipedream/google_drive";

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
    layoutId: {
      type: "string",
      label: "Layout ID",
      description: "The ID of a slide layout",
      optional: true,
      async options({ presentationId }) {
        const { layouts } = await this.getPresentation(presentationId);
        return layouts.map((layout) => ({
          label: layout.layoutProperties.name,
          value: layout.objectId,
        }));
      },
    },
    slideId: {
      type: "string",
      label: "Slide ID",
      description: "The ID of a slide",
      async options({ presentationId }) {
        const { slides } = await this.getPresentation(presentationId);
        return slides.map((slide) => ({
          label: slide.slideProperties.layoutObjectId,
          value: slide.objectId,
        }));
      },
    },
    shapeId: {
      type: "string",
      label: "Shape ID",
      description: "The ID of a shape",
      async options({
        presentationId, slideId, textOnly = false,
      }) {
        const { pageElements } = await this.getSlide(presentationId, slideId);
        let shapes = pageElements;
        if (textOnly) {
          shapes = shapes.filter((element) => element?.shape?.shapeType === "TEXT_BOX");
        }
        return shapes.map((element) => ({
          label: element.shape?.placeholder?.type || element?.shape?.shapeType || element.objectId,
          value: element.objectId,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of a table",
      async options({
        presentationId, slideId,
      }) {
        const { pageElements } = await this.getSlide(presentationId, slideId);
        let tables = pageElements.filter((element) => element?.table);
        return tables.map((element) => ({
          label: `${element.table.rows} x ${element.table.columns} Table`,
          value: element.objectId,
        }));
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
    batchUpdate(presentationId, requests) {
      const slides = this.slides();
      return slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests,
        },
      });
    },
    refreshChart(presentationId, chartId) {
      const requests = [
        {
          refreshSheetsChart: {
            objectId: chartId,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    createSlide(presentationId, data) {
      const requests = [
        {
          createSlide: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    createShape(presentationId, data) {
      const requests = [
        {
          createShape: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    insertText(presentationId, data) {
      const requests = [
        {
          insertText: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    replaceAllText(presentationId, data) {
      const requests = [
        {
          replaceAllText: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    createTable(presentationId, data) {
      const requests = [
        {
          createTable: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    insertTableRows(presentationId, data) {
      const requests = [
        {
          insertTableRows: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    insertTableColumns(presentationId, data) {
      const requests = [
        {
          insertTableColumns: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    deleteTableRow(presentationId, data) {
      const requests = [
        {
          deleteTableRow: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    deleteTableColumn(presentationId, data) {
      const requests = [
        {
          deleteTableColumn: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    createImage(presentationId, data) {
      const requests = [
        {
          createImage: {
            ...data,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
    },
    deleteObject(presentationId, objectId) {
      const requests = [
        {
          deleteObject: {
            objectId,
          },
        },
      ];
      return this.batchUpdate(presentationId, requests);
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
    async getSlide(presentationId, slideId) {
      const slides = this.slides();
      const request = {
        presentationId,
        pageObjectId: slideId,
      };
      return (await slides.presentations.pages.get(request)).data;
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
