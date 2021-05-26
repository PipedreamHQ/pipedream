const admin = require("firebase-admin");
const axios = require("axios");

module.exports = {
  type: "app",
  app: "firebase_admin_sdk",
  propDefinitions: {
    path: {
      type: "string",
      label: "Path",
      description: "A relative path to the location of child data",
    },
    query: {
      type: "string",
      label: "Structured Query",
      description:
        "The JSON contents of the Structured Query. https://cloud.google.com/firestore/docs/reference/rest/v1beta1/StructuredQuery",
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description:
        "API Key refers to the Web API Key, which can be obtained on the project settings page in your admin console.",
      secret: true,
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
      return await admin.initializeApp({
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
      const app = admin.app();
      await app.delete();
    },
    /**
     * Retrieves the default Firebase app instance.
     */
    getApp() {
      return admin.app();
    },
    _getHeaders(token = null) {
      const defaultHeader = {
        "Content-Type": "applicaton/json",
      };
      const headers = token ?
        {
          ...defaultHeader,
          Authorization: `Bearer ${token}`,
        }
        : defaultHeader;
      return headers;
    },
    async _makeRequest(method, url, data, token = null) {
      const config = {
        method,
        url,
        headers: this._getHeaders(token),
        data,
      };
      return (await axios(config)).data;
    },
    /**
     * Retrieves a Bearer token for use with the Firebase REST API.
     * @param {string} apiKey - the Web API Key, which is obtained from the project
     * settings page in the admin console
     */
    async getToken(apiKey) {
      const { clientEmail } = this.$auth;
      let newCustomToken;
      await admin
        .auth()
        .createCustomToken(clientEmail)
        .then((customToken) => {
          newCustomToken = customToken;
        })
        .catch((error) => {
          console.log("Error creating custom token:", error);
        });
      const data = {
        token: newCustomToken,
        returnSecureToken: true,
      };
      return await this._makeRequest(
        "POST",
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
        data,
      );
    },
    /**
     * Exchanges a refresh Token for a new Bearer token for use with the Firebase REST API.
     * @param {string} apiKey - the Web API Key, which is obtained from the project settings
     * page in the admin console
     * @param {string} refreshToken - the refreshToken previously retrieved in the function
     * getToken(apiKey).
     */
    async refreshToken(apiKey, refreshToken) {
      const data = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      };
      return await this._makeRequest(
        "POST",
        `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
        data,
      );
    },
    /**
     * Returns an array of the documents returned from the structured query.
     * @param {string} token - Bearer token for use in request header
     * @param {string} parent - The parent resource name
     * @param {string} structuredQuery - A structured query in the format specified in 
     * this documentation:
     * https://cloud.google.com/firestore/docs/reference/rest/v1/StructuredQuery
     */
    async runQuery(token, parent, structuredQuery) {
      const data = {
        structuredQuery,
      };
      return await this._makeRequest(
        "POST",
        `https://firestore.googleapis.com/v1/${parent}:runQuery`,
        data,
        token,
      );
    },
  },
};
