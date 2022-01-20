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
      description:
        "Enter a [structured query](https://cloud.google.com/firestore/docs/reference/rest/v1beta1/StructuredQuery) that returns new records from your target collection. Example: `{ \"select\": { \"fields\": [] }, \"from\": [ { \"collectionId\": \"<YOUR COLLECTION>\", \"allDescendants\": \"true\" } ] }`",
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
  },
};
