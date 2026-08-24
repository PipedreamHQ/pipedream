import { ConfigurationError } from "@pipedream/platform";
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
    // Shared by the table-oriented actions and the update-*-style actions,
    // which reuse the same cell coordinates to scope a request to one cell.
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "The 0-based index of the target table row.",
      optional: true,
      min: 0,
    },
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "The 0-based index of the target table column.",
      optional: true,
      min: 0,
    },
    // Shared by the update-*-style actions, which address a span of a shape's
    // or a cell's text rather than a whole page element.
    rangeType: {
      type: "string",
      label: "Range Type",
      description: "Which part of the text the request covers. `ALL` covers every character and ignores the indices below; `FROM_START_INDEX` runs from **Start Index** to the end; `FIXED_RANGE` covers **Start Index** up to **End Index**.",
      optional: true,
      default: "ALL",
      options: [
        "ALL",
        "FROM_START_INDEX",
        "FIXED_RANGE",
      ],
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "The 0-based index where the range begins. Required when **Range Type** is `FROM_START_INDEX` or `FIXED_RANGE`, and ignored when it is `ALL`.",
      optional: true,
      min: 0,
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "The 0-based index where the range ends, exclusive. Required when **Range Type** is `FIXED_RANGE`, and must be greater than **Start Index**.",
      optional: true,
      min: 1,
    },
    // Shared by the two element-styling actions.
    contentAlignment: {
      type: "string",
      label: "Content Alignment",
      description: "How text sits vertically within the element. `TOP` aligns it to the top edge, `MIDDLE` centers it, and `BOTTOM` aligns it to the bottom edge.",
      optional: true,
      options: [
        "TOP",
        "MIDDLE",
        "BOTTOM",
      ],
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "A 6-digit hex color (e.g. `#EEEEEE`).",
      optional: true,
    },
    backgroundAlpha: {
      type: "string",
      label: "Background Opacity",
      description: "Opacity of the fill, from `0` (fully transparent) to `1` (fully opaque). Only applies when the matching color is set. Sent as a string so that `0` is distinguishable from unset.",
      optional: true,
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
    async listPresentationsOptions(driveId, pageToken = null, limitToMyDrive = false) {
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
      } else if (!limitToMyDrive) {
        request = {
          ...request,
          corpora: "allDrives",
          pageToken,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }
      return this.listFilesOptions(pageToken, request);
    },
    getPresentationId(idOrUrl) {
      const input = String(idOrUrl).trim();
      if (!input) {
        throw new ConfigurationError("Presentation ID is required.");
      }
      // Published presentations use /presentation/d/e/{token}/pub and have no
      // editable ID that presentations.get accepts, so reject them explicitly
      // rather than extracting the literal "e" segment as the ID.
      if (/\/presentation\/d\/e\//.test(input)) {
        throw new ConfigurationError("Published presentation URLs (`/presentation/d/e/...`) are not supported. Provide the presentation's ID or its editable URL (`https://docs.google.com/presentation/d/{ID}/edit`).");
      }
      // Accept a plain presentation ID or a full Slides URL
      // (e.g. https://docs.google.com/presentation/d/{ID}/edit).
      const match = input.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
      return match
        ? match[1]
        : input;
    },
    async getPresentation(presentationId, fields) {
      const slides = this.slides();
      const request = {
        presentationId,
        ...fields && {
          fields,
        },
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
