import { ConfigurationError } from "@pipedream/platform";
import slides from "@googleapis/slides";
import googleDrive from "@pipedream/google_drive";
import { v4 as uuid } from "uuid";
import {
  CONTENT_ALIGNMENTS, TEXT_PLACEHOLDER_TYPES,
} from "./common/constants.mjs";

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
      label: "Layout",
      description: "The layout to base the slide on, given as its name (e.g. `TITLE_AND_BODY`, `TITLE`, `TITLE_AND_TWO_COLUMNS`), its display name (e.g. `Title and body`) or its object ID. Use **Get Presentation** and read `layouts[]` to see the layouts in a deck with a custom template. If omitted, the slide uses the BLANK layout and has no title or body placeholders.",
      optional: true,
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
    async findPresentations(drive, name) {
      let q = "mimeType='application/vnd.google-apps.presentation' and trashed=false";
      if (name) {
        // Drive's "name contains" only prefix-matches the whole name string (e.g. it
        // wouldn't match "Board" against "Q3 Board Deck"). OR in "fullText contains",
        // which does token-level matching, so a mid-name word still matches — the same
        // workaround google_docs-find-document uses for its name/content search.
        const escaped = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        q += ` and (name contains '${escaped}' or fullText contains '${escaped}')`;
      }
      let request = {
        q,
        fields: "nextPageToken,files(id,name,modifiedTime,webViewLink)",
        orderBy: "modifiedTime desc",
      };
      // getDriveId(drive) collapses both "My Drive" and "no selection" to null, so
      // branch on the raw drive value first to keep an explicit My Drive scoped to
      // corpora "user" instead of falling through to "allDrives".
      if (drive && this.isMyDrive(drive)) {
        request = {
          ...request,
          corpora: "user",
          supportsAllDrives: true,
        };
      } else if (drive) {
        request = {
          ...request,
          corpora: "drive",
          driveId: this.getDriveId(drive),
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      } else {
        request = {
          ...request,
          corpora: "allDrives",
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }
      // Drive treats `pageSize` as a maximum, so a short page can still carry a
      // `nextPageToken`. Keep following it until `limit` is filled or pages run out,
      // otherwise a search term matching page 2+ results in a false "not found".
      const limit = 100;
      const files = [];
      let pageToken;
      do {
        const page = await this.listFilesInPage(pageToken, {
          ...request,
          pageSize: Math.min(100, limit - files.length),
        });
        files.push(...(page.files || []));
        pageToken = page.nextPageToken;
      } while (pageToken && files.length < limit);

      return files.slice(0, limit).map((file) => ({
        id: file.id,
        name: file.name,
        url: file.webViewLink || `https://docs.google.com/presentation/d/${file.id}/edit`,
        modifiedTime: file.modifiedTime,
      }));
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
    // Rethrows API errors unchanged so callers keep the HTTP status. A 403 or
    // 404 gets an access hint instead, with the original error kept as its
    // `cause`; Google returns 404 when the account cannot see the presentation.
    withPermissionHint(error) {
      const status = error?.response?.status ?? error?.status;
      if (status === 403 || status === 404) {
        const hinted = new ConfigurationError(`${String(error.message).replace(/\.?$/, ".")} Make sure the presentation ID is correct and the connected account has edit access to the presentation.`);
        hinted.cause = error;
        return hinted;
      }
      return error;
    },
    async getSlideCreationContext(presentationId) {
      const {
        slides = [], masters = [], layouts = [],
      } = await this.getPresentation(presentationId,
        "slides(objectId,slideProperties(masterObjectId)),masters(objectId),layouts(objectId,layoutProperties(name,displayName,masterObjectId),pageElements(objectId,shape(placeholder)))");
      return {
        slideCount: slides.length,
        slideMasterIds: slides.map(({ slideProperties }) => slideProperties?.masterObjectId),
        masterIds: masters.map(({ objectId }) => objectId),
        layouts,
      };
    },
    // createSlide only accepts a layout from one master: that of the slide
    // before the insertion point, the first slide's when inserting at 0, or
    // the first master when the presentation has no slides. Any other layout
    // is rejected with a 400.
    getInsertionMasterId({
      slideMasterIds, masterIds,
    }, insertionIndex) {
      if (!slideMasterIds.length) {
        return masterIds[0];
      }
      const previous = insertionIndex == null
        ? slideMasterIds.length - 1
        : Math.max(insertionIndex - 1, 0);
      return slideMasterIds[previous];
    },
    // Accepts a layout's object ID (case-sensitive), its name (e.g.
    // `TITLE_AND_BODY`) or its display name (e.g. `Title and body`), matched
    // only against the layouts of `masterId` when one is given.
    resolveLayout(layouts, layout, masterId) {
      const input = String(layout).trim();
      const wanted = input.toLowerCase();
      const candidates = masterId
        ? layouts.filter(({ layoutProperties: props = {} }) => props.masterObjectId === masterId)
        : layouts;
      const matchesName = ({ layoutProperties: props = {} }) =>
        props.name?.toLowerCase() === wanted || props.displayName?.toLowerCase() === wanted;
      const found = candidates.find(({ objectId }) => objectId === input)
        || candidates.find(matchesName);
      if (!found) {
        const available = candidates
          .map(({
            objectId, layoutProperties: props = {},
          }) => `${props.name || props.displayName} (${objectId})`)
          .join(", ");
        // Only blame the position when the layout exists on another master.
        const existsElsewhere = layouts.some((l) => l.objectId === input || matchesName(l));
        const reason = existsElsewhere
          ? "is not available at this position. A new slide can only use layouts from the master of the slide before it (or of the first slide, when inserting at position 0)"
          : "was not found in this presentation";
        throw new ConfigurationError(`Layout "${layout}" ${reason}. Available layouts: ${available || "none"}.`);
      }
      return found;
    },
    newSlideObjectId() {
      return `slide_${uuid().replace(/-/g, "")
        .slice(0, 16)}`;
    },
    // Assigns a predictable object ID to each text placeholder on the layout, so
    // the new slide's placeholders can be returned or filled in the same request.
    // `ordinal` is the placeholder's position among those of the same type,
    // since layouts (e.g. ones imported from PowerPoint) may number indexes
    // from 1 or leave gaps.
    buildPlaceholderMappings(slideObjectId, layout) {
      const placeholders = (layout.pageElements || [])
        .map(({ shape }) => shape?.placeholder)
        .filter((placeholder) => TEXT_PLACEHOLDER_TYPES.includes(placeholder?.type));
      const seen = new Set();
      const ordinals = new Map();
      return placeholders
        .map(({
          type, index = 0,
        }) => ({
          type,
          index,
          objectId: `${slideObjectId}_${type.toLowerCase()}_${index}`,
        }))
        .filter(({ objectId }) => !seen.has(objectId) && seen.add(objectId))
        .sort((a, b) => a.index - b.index)
        .map((placeholder) => {
          const ordinal = ordinals.get(placeholder.type) ?? 0;
          ordinals.set(placeholder.type, ordinal + 1);
          return {
            ...placeholder,
            ordinal,
          };
        });
    },
    toPlaceholderIdMappings(placeholders) {
      return placeholders.map(({
        type, index, objectId,
      }) => ({
        layoutPlaceholder: {
          type,
          index,
        },
        objectId,
      }));
    },
    validateInsertionIndex(insertionIndex, slideCount) {
      if (insertionIndex != null && (insertionIndex < 0 || insertionIndex > slideCount)) {
        throw new ConfigurationError(`Insertion Index ${insertionIndex} is out of range: the presentation has ${slideCount} slide(s), so it must be between 0 and ${slideCount}. Omit it to add the slide at the end.`);
      }
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
