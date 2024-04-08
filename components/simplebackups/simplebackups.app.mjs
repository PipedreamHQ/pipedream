import { axios } from "@pipedream/platform";

/**
 * Represents the SimpleBackups app.
 * @typedef {Object} SimpleBackupsApp
 * @property {string} type - The type of the app.
 * @property {string} app - The name of the app.
 * @property {string} name - The display name of the app.
 * @property {string} description - The description of the app.
 * @property {Object} propDefinitions - The definitions of the app's properties.
 * @property {Object} methods - The methods of the app.
 */

/**
 * The SimpleBackups app.
 * @type {SimpleBackupsApp}
 */
export default {
  type: "app",
  app: "simplebackups",
  description:
    "SimpleBackups is a backup service for your databases, files, and servers.",

  propDefinitions: {},

  methods: {
    /**
     * Returns the API URL for SimpleBackups.
     * @private
     * @returns {string} The API URL.
     */
    _apiUrl() {
      return "https://my.simplebackups.io/api";
    },

    /**
     * Logs the authentication keys to the console.
     */
    authKeys() {
      console.log(Object.keys(this.$auth));
    },

    /**
     * Returns the Axios headers for making requests.
     * @private
     * @returns {Object} The Axios headers.
     */
    _getAxiosHeaders() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },

    /**
     * Makes an Axios request to the specified endpoint.
     * @private
     * @param {Object} options - The options for the request.
     * @param {string} options.endpoint - The endpoint to make the request to.
     * @param {Object} [options.args] - Additional arguments for the request.
     * @returns {Promise} A promise that resolves with the response.
     */
    _makeAxiosRequest({
      $ = this, endpoint, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${endpoint}`,
        headers: this._getAxiosHeaders(),
        ...args,
      });
    },

    /**
     * Retrieves the download link for a backup.
     * @param {string} backupId - The ID of the backup.
     * @param {string} [backupLogId=null] - The ID of the backup log.
     * @returns {Promise} A promise that resolves with the download link.
     */
    async getDownloadLink(backupId, backupLogId = null) {
      let endpoint = `/backup/${backupId}/download-link`;
      if (backupLogId) {
        endpoint = `/backup/${backupId}/download-link/${backupLogId}`;
      }
      return this._makeAxiosRequest({
        endpoint,
      });
    },

    /**
     * Retrieves a list of backups.
     * @param {string} [filters=""] - Additional filters for the list.
     * @returns {Promise} A promise that resolves with the list of backups.
     */
    async listBackups(filters = "") {
      return this._makeAxiosRequest({
        endpoint: "/backup/list" + filters,
      });
    },

    /**
     * Retrieves a list of servers.
     * @returns {Promise} A promise that resolves with the list of servers.
     */
    async listServers() {
      return this._makeAxiosRequest({
        endpoint: "/server/list",
      });
    },

    /**
     * Retrieves a list of storages.
     * @param {string} [filters=""] - Additional filters for the list.
     * @returns {Promise} A promise that resolves with the list of storages.
     */
    async listStorages(filters = "") {
      return this._makeAxiosRequest({
        endpoint: "/storage/list" + filters,
      });
    },

    /**
     * Pauses a backup.
     * @param {string} backupId - The ID of the backup to pause.
     * @returns {Promise} A promise that resolves when the backup is paused.
     */
    async pauseBackup(backupId) {
      return this._makeAxiosRequest({
        endpoint: `/backup/${backupId}/pause`,
        method: "PATCH",
      });
    },

    /**
     * Resumes a paused backup.
     * @param {string} backupId - The ID of the backup to resume.
     * @returns {Promise} A promise that resolves when the backup is resumed.
     */
    async resumeBackup(backupId) {
      return this._makeAxiosRequest({
        endpoint: `/backup/${backupId}/resume`,
        method: "PATCH",
      });
    },

    /**
     * Runs a backup.
     * @param {string} backupId - The ID of the backup to run.
     * @returns {Promise} A promise that resolves when the backup is run.
     */
    async runBackup(backupId) {
      return this._makeAxiosRequest({
        endpoint: `/backup/${backupId}/run`,
      });
    },
  },
};
