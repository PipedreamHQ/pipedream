import docs from "@googleapis/docs";
import googleDrive from "@pipedream/google_drive";
import utils from "./common/utils.mjs";
import markdownParser from "./common/markdown-parser.mjs";

export default {
  type: "app",
  app: "google_docs",
  propDefinitions: {
    ...googleDrive.propDefinitions,
    docId: {
      type: "string",
      label: "Document",
      description: "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
      useQuery: true,
      async options({
        prevContext, driveId, query,
      }) {
        const { nextPageToken } = prevContext;
        return this.listDocsOptions(driveId, query, nextPageToken);
      },
    },
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The Image ID",
      async options({ documentId }) {
        const { inlineObjects: images } = await this.getDocument(documentId);
        if (!images) return [];
        return Object.values(images)
          .map((image) => ({
            label: image.inlineObjectProperties?.embeddedObject?.imageProperties?.sourceUri,
            value: image.objectId,
          }))
          .filter((image) => image.label);
      },
    },
    tabId: {
      type: "string",
      label: "Tab ID",
      description: "The Tab ID",
      optional: true,
      async options({ documentId }) {
        const { tabs } = await this.getDocument(documentId, true);
        return Object.values(tabs).map(({ tabProperties }) => ({
          label: tabProperties.title,
          value: tabProperties.tabId,
        }));
      },
    },
    imageUri: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image you want to insert into the doc",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
    },
    appendAtBeginning: {
      type: "boolean",
      label: "Append at Beginning",
      description: "Whether to append at the beginning (`true`) of the document or at the end (`false`). Defaults to `false`",
      default: false,
      optional: true,
    },
    matchCase: {
      type: "boolean",
      label: "Match Case",
      description: "Case sensitive search (`true`) or not (`false`). Defaults to `false`",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...googleDrive.methods,
    docs() {
      const auth = new docs.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return docs.docs({
        version: "v1",
        auth,
      });
    },
    _insertAtBeginning(requestObj) {
      return {
        ...requestObj,
        location: {
          index: 1,
        },
      };
    },
    _insertAtEnd(requestObj) {
      return {
        ...requestObj,
        endOfSegmentLocation: {},
      };
    },
    _buildRequest(requestObj, atBeginning) {
      return atBeginning
        ? this._insertAtBeginning(requestObj)
        : this._insertAtEnd(requestObj);
    },
    _batchUpdate(documentId, requestName, request) {
      return this.docs().documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              [requestName]: request,
            },
          ],
        },
      });
    },
    async getDocument(documentId, includeTabsContent = false) {
      const { data } = await this.docs().documents.get({
        documentId,
        includeTabsContent,
      });
      const doc = includeTabsContent
        ? data
        : utils.addTextContentToDocument(data);
      return doc;
    },
    async createEmptyDoc(title) {
      const { data: createdDoc } = await this.docs().documents.create({
        requestBody: {
          title,
        },
      });
      return createdDoc;
    },
    async insertText(documentId, text, atBeginning = false) {
      const request = this._buildRequest(text, atBeginning);
      return this._batchUpdate(documentId, "insertText", request);
    },
    async replaceText(documentId, text) {
      return this._batchUpdate(documentId, "replaceAllText", text);
    },
    async appendImage(documentId, image, atBeginning = false) {
      const request = this._buildRequest(image, atBeginning);
      return this._batchUpdate(documentId, "insertInlineImage", request);
    },
    async replaceImage(documentId, image) {
      return this._batchUpdate(documentId, "replaceImage", image);
    },
    async insertTable(documentId, table) {
      return this._batchUpdate(documentId, "insertTable", table);
    },
    async insertPageBreak(documentId, request) {
      return this._batchUpdate(documentId, "insertPageBreak", request);
    },
    async createDocument(request) {
      const { data } = await this.docs().documents.create({
        requestBody: request,
      });
      return data;
    },
    async listDocsOptions(driveId, query, pageToken = null) {
      let q = "mimeType='application/vnd.google-apps.document'";
      if (query) {
        q = `${q} and name contains '${query}'`;
      }
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
    async insertMarkdownText(documentId, markdown) {
      try {
        const parseResult = markdownParser.parseMarkdown(markdown);
        const batchRequests = markdownParser.convertToGoogleDocsRequests(parseResult);

        if (batchRequests.length === 0) {
          return null;
        }

        // Execute all requests in a single batch update
        return this.docs().documents.batchUpdate({
          documentId,
          requestBody: {
            requests: batchRequests,
          },
        });
      } catch (error) {
        throw new Error(`Failed to insert markdown text: ${error.message}`);
      }
    },
  },
};
