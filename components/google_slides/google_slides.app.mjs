import { ConfigurationError } from "@pipedream/platform";
import slides from "@googleapis/slides";
import googleDrive from "@pipedream/google_drive";
import { CONTENT_ALIGNMENTS } from "./common/constants.mjs";

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
    staticPresentationId: {
      type: "string",
      label: "Presentation ID",
      description: "The ID of the presentation. This is the long string in the URL: `https://docs.google.com/presentation/d/{PRESENTATION_ID}/edit`. A full presentation URL is also accepted. Use **Find Presentation** to resolve a name to its ID.",
    },
    staticSlideId: {
      type: "string",
      label: "Slide ID",
      description: "The object ID of the slide (e.g. `p1` or `g1a2b3c4d5`). Use **Get Presentation** and read `slides[].objectId`.",
    },
    pageElementId: {
      type: "string",
      label: "Page Element ID",
      description: "The object ID of the shape, image, table, or other page element to act on. Use **Get Presentation** and read `slides[].pageElements[].objectId`.",
    },
    // Shared by the styling actions; individual actions override the label or
    // description where their wording differs.
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "The 0-based row of the target table cell.",
      min: 0,
      optional: true,
    },
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "The 0-based column of the target table cell.",
      min: 0,
      optional: true,
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "Character index to style from, inclusive. On its own, styles from here to the end of the text. Omit both indices to style all of it.",
      min: 0,
      optional: true,
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "Character index to style up to, exclusive. Requires **Start Index**, and must be greater than it.",
      min: 0,
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "A hex code (e.g. `#EEEEEE`) or one of the deck's theme colors (e.g. `ACCENT1`).",
      optional: true,
    },
    backgroundOpacity: {
      type: "integer",
      label: "Background Opacity",
      description: "Opacity as a whole percentage, from `0` (fully transparent) to `100` (fully opaque). Can be set on its own to change an existing fill's opacity without restating its color.",
      min: 0,
      max: 100,
      optional: true,
    },
    contentAlignment: {
      type: "string",
      label: "Content Alignment",
      description: "Vertical alignment of the text within the element. One of `TOP`, `MIDDLE` or `BOTTOM` - e.g. `MIDDLE` to centre the text vertically.",
      options: CONTENT_ALIGNMENTS,
      optional: true,
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
    _findPageElement(presentation, objectId) {
      const walk = (elements, slideId, groupId) => {
        for (const element of elements || []) {
          if (element.objectId === objectId) {
            return {
              element,
              slideId,
              groupId,
            };
          }
          const found = walk(element.elementGroup?.children, slideId, element.objectId);
          if (found) {
            return found;
          }
        }
        return null;
      };

      for (const slide of presentation.slides || []) {
        const found = walk(slide.pageElements, slide.objectId);
        if (found) {
          return found;
        }
      }
      return null;
    },
    async getPageElement(presentationId, objectId) {
      const presentation = await this.getPresentation(presentationId);
      const found = this._findPageElement(presentation, objectId);
      if (!found) {
        throw new ConfigurationError(`No page element with ID "${objectId}" was found in presentation ${presentationId}. Use Get Presentation to list slides[].pageElements[].objectId.`);
      }
      return found;
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
