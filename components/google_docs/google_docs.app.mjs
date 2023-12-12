import docs from "@googleapis/docs";
import googleDrive from "../google_drive/google_drive.app.mjs";

export default {
  type: "app",
  app: "google_docs",
  propDefinitions: {
    ...googleDrive.propDefinitions,
    docId: {
      type: "string",
      label: "Document",
      description: "Select a document or enter a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or to manually enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
      async options({
        prevContext, driveId,
      }) {
        const { nextPageToken } = prevContext;
        return this.listDocsOptions(driveId, nextPageToken);
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
    imageUri: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image you want to insert to the doc",
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
    async getDocument(documentId) {
      const { data } = await this.docs().documents.get({
        documentId,
      });
      return data;
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
