import admin from "firebase-admin";
import { axios } from "@pipedream/platform";
import googleAuth from "google-auth-library";

export default {
  type: "app",
  app: "firebase_admin_sdk",
  propDefinitions: {
    path: {
      type: "string",
      label: "Path",
      description: "A [relative path](https://firebase.google.com/docs/reference/rules/rules.Path) to the location of child data",
    },
    query: {
      type: "string",
      label: "Structured Query",
      description: "Enter a [structured query](https://cloud.google.com/firestore/docs/reference/rest/v1beta1/StructuredQuery) that returns new records from your target collection. Example: `{ \"select\": { \"fields\": [] }, \"from\": [ { \"collectionId\": \"<YOUR COLLECTION>\", \"allDescendants\": \"true\" } ] }`",
    },
    collection: {
      type: "string",
      label: "Collection",
      description: "The collection containing the documents to list",
      async options() {
        const collections = await this.listCollections();
        return collections.map((collection) => collection._queryOptions.collectionId);
      },
    },
    document: {
      type: "string",
      label: "Document",
      description: "The document to update",
      async options({ collection }) {
        const documents = await this.listDocuments(collection);
        return documents.map((doc) => doc._ref._path.segments[1]);
      },
    },
    data: {
      type: "object",
      label: "Data",
      description: "An Object containing the data for the new document",
    },
  },
  methods: {
    /**
     * Creates and initializes a Firebase app instance.
     */
    async initializeApp() {
      const {
        projectId,
        clientEmail,
        privateKey,
      } = this.$auth;
      const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com/`,
      });
    },
    /**
     * Renders this app instance unusable and frees the resources of all associated services.
     */
    async deleteApp() {
      return await this.getApp().delete();
    },
    /**
     * Retrieves the default Firebase app instance.
     */
    getApp() {
      return admin.app();
    },
    _getHeaders(token) {
      const defaultHeader = {
        "Content-Type": "applicaton/json",
      };
      const headers = token
        ? {
          ...defaultHeader,
          Authorization: `Bearer ${token}`,
        }
        : defaultHeader;
      return headers;
    },
    async _makeRequest(method, url, data, params = {}, token = null) {
      const config = {
        method,
        url,
        headers: this._getHeaders(token),
        data,
        params,
      };
      return axios(this, config);
    },
    /**
     * Retrieves a Bearer token for use with the Firebase REST API.
     * @returns {object} returns an object containing a new token and refresh token
     */
    async _getToken() {
      const {
        clientEmail,
        privateKey,
      } = this.$auth;
      const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
      const SCOPES = [
        "https://www.googleapis.com/auth/cloud-platform",
      ];
      const jwtClient = await new googleAuth.JWT(
        clientEmail,
        null,
        formattedPrivateKey,
        SCOPES,
        null,
      );
      const { access_token: accessToken } = await jwtClient.authorize();
      return accessToken;
    },
    /**
     * @param {string} structuredQuery - A structured query in the format specified in
     * this documentation:
     * https://cloud.google.com/firestore/docs/reference/rest/v1/StructuredQuery
     * @returns {array} an array of the documents returned from the structured query
     */
    async runQuery(structuredQuery) {
      const idToken = await this._getToken();
      const { projectId } = this.$auth;
      const parent = `projects/${projectId}/databases/(default)/documents`;
      const data = {
        structuredQuery,
      };
      return this._makeRequest(
        "POST",
        `https://firestore.googleapis.com/v1/${parent}:runQuery`,
        data,
        null,
        idToken,
      );
    },
    async listCollections() {
      try {
        await this.initializeApp();
        const firebase = this.getApp();
        return await firebase.firestore().listCollections();
      } catch (err) {
        throw new Error(err);
      } finally {
        this.deleteApp();
      }
    },
    async listDocuments(collection) {
      try {
        await this.initializeApp();
        const firebase = this.getApp();
        return await firebase.firestore().collection(collection)
          .listDocuments()
          .then(documentRefs => {
            return firebase.firestore().getAll(...documentRefs);
          });
      } catch (err) {
        throw new Error(err);
      } finally {
        this.deleteApp();
      }
    },
  },
};
