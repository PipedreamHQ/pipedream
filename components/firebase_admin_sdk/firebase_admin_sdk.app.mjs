import admin from "firebase-admin";
import { axios } from "@pipedream/platform";
import googleAuth from "google-auth-library";
import constants from "./common/constants.mjs";

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
      async options({ region }) {
        try {
          await this.initializeApp(region);
          const collections = await this.listCollections();
          return collections.map((collection) => collection._queryOptions.collectionId);
        } finally {
          await this.deleteApp();
        }
      },
    },
    document: {
      type: "string",
      label: "Document",
      description: "The document to update",
      async options({
        collection, region,
      }) {
        try {
          await this.initializeApp(region);
          const documents = await this.listDocuments(collection);
          return documents.map((doc) => doc._ref._path.segments[1]);
        } finally {
          await this.deleteApp();
        }
      },
    },
    data: {
      type: "object",
      label: "Data",
      description: "An Object containing the data for the new document",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of documents to return. Defaults to 20.",
      optional: true,
      default: 20,
    },
    databaseRegion: {
      type: "string",
      label: "Database Region",
      description: "The region where your Realtime Database is located. [Additional Info](https://firebase.google.com/docs/projects/locations#rtdb-locations)",
      options: constants.DATABASE_REGION_OPTIONS,
      default: "firebaseio.com",
      optional: true,
    },
  },
  methods: {
    /**
     * Creates and initializes a Firebase app instance.
     */
    async initializeApp(region) {
      const {
        projectId,
        clientEmail,
        privateKey,
        customDatabaseUrl,
      } = this.$auth;
      const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
        databaseURL: customDatabaseUrl || `https://${projectId}-default-rtdb.${region}/`,
      });
    },
    /**
     * Renders this app instance unusable and frees the resources of all associated services.
     */
    async deleteApp() {
      return this.getApp().delete();
    },
    /**
     * Retrieves the default Firebase app instance.
     */
    getApp() {
      return admin.app();
    },
    _getHeaders(token) {
      const defaultHeader = {
        "Content-Type": "application/json",
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
    getReference(path) {
      return this.getApp().database()
        .ref(path);
    },
    getFirestore() {
      return this.getApp().firestore();
    },
    getCollection(collection) {
      return this.getFirestore().collection(collection);
    },
    getDocument({
      collection, document,
    }) {
      return this.getCollection(collection).doc(document);
    },
    async listCollections() {
      return this.getFirestore().listCollections();
    },
    async listDocuments(collection, maxResults) {
      const documentRefs = [];
      let pageTotal, offset = 0;
      const pageSize = constants.DEFAULT_PAGE_SIZE;
      do {
        pageTotal = 0;
        await this.getCollection(collection).limit(pageSize)
          .offset(offset)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((documentSnapshot) => {
              pageTotal++;
              documentRefs.push(documentSnapshot.ref);
            });
          });
        offset += pageSize;
      } while (pageTotal == pageSize && documentRefs.length < maxResults);
      if (documentRefs.length > maxResults) {
        documentRefs.length = maxResults;
      }
      return this.getFirestore().getAll(...documentRefs);
    },
    async createDocument(collection, data, customId) {
      const collectionRef = this.getCollection(collection);

      return customId ?
        collectionRef.doc(customId).set(data) :
        collectionRef.add(data);
    },
    async updateDocument(collection, document, data) {
      const doc = this.getDocument({
        collection,
        document,
      });
      return doc.update(data);
    },
    async createRealtimeDBRecord(path, data) {
      const record = this.getReference(path);
      return record.update(data);
    },
  },
};
