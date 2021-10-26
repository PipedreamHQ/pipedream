import axios from "axios";
import { axios as pipedreamAxios } from "@pipedream/platform";

const CONFECTION_RESULTS_PER_PAGE = 50;

export default {
  type: "app",
  app: "confection",
  propDefinitions: {
    uuid: {
      type: "string",
      label: "UUID",
      description: "Provide the UUID to retrieve related UUIDs of.",
    },
    likeness: {
      type: "integer",
      label: "Likeness Score",
      min: 50,
      max: 100,
      default: 50,
      optional: true,
      description:
        "Accepts values 50 to 100. 100 meaning only pull back records where we are certain the UUIDs are the same record",
    },
    stopOnNoResults: {
      label:
        "Should the execution of this step be stopped if no results are found?",
      type: "boolean",
      default: true,
      optional: true,
      description:
        "If set to true, action execution will be halted when no related UUIDs are found and any subsequent steps that rely on data from this step will not be run.",
    },
    triggerField: {
      type: "string",
      label: "Field of Significance",
      description:
        "Define a field to be used to indicate that a UUID is significant enough to be a lead. You must enter the form input name which Confection uses as the api name of the field.",
      default: "email",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description:
        "Provide the event name to watch. All accounts have `loadtime` & `pageviewBatch` events by default.",
    },
  },
  methods: {
    getBaseUrl() {
      return `https://transmission.confection.io/${this.$auth.account_id}`;
    },
    /**
     * Collect results from paginated Confection Live API
     *
     * @param {string} path - Paginated Confection Live API path (relative to base)
     * @returns {Promise<object>}
     */
    async requestPaginatedData(path) {
      const data = await this.postRequest(path);
      const pageCount = Math.ceil(
        data.results_number / CONFECTION_RESULTS_PER_PAGE,
      );
      const output = data.collection;

      for (let counter = 2; counter <= pageCount; counter++) {
        const { data } = await this.postRequest(`${path}/page/${counter}`);

        Object.assign(output, data.collection);
      }

      return output;
    },
    /**
     * Send POST request to Confection Live API and return the results
     *
     * @param {string} path - Confection Live API path (relative to base)
     * @param {object|undefined} $ - Pipedream action $ object (if used in action)
     * @returns {Promise<object>}
     */
    async postRequest(path, $) {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/${path}`;
      const data = {
        key: this.$auth.secret_key,
      };
      const headers = {
        Accept: "application/json",
      };

      if ($) {
        return pipedreamAxios($, {
          url,
          method: "POST",
          data,
          headers,
        });
      }

      const response = await axios.post(url, data, {
        headers,
      });

      return response.data;
    },
    /**
     * Get UUIDs related to the provided one based on certain likeness
     *
     * @param {string} uuid - UUID
     * @param {number} likeness - Similarity of retrieved UUIDs to the provided one
     * @param {object} $ - Pipedream action $ object
     * @returns {Promise<object>}
     */
    async getRelatedUUIDs(uuid, likeness, $) {
      return this.postRequest(`${uuid}/related/${likeness}`, $);
    },
    /**
     * Get details of the provided UUID
     *
     * @param {string} uuid - UUID
     * @param {object} $ - Pipedream action $ object
     * @returns {Promise<object>}
     */
    async getUUIDDetails(uuid, $) {
      return this.postRequest(`${uuid}/full`, $);
    },
    /**
     * Get data from Confection leads Live API endpoint
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     * @returns {Promise<object>}
     */
    async getNewOrUpdatedLeads(lastTimestamp, timestamp) {
      return this.requestPaginatedData(
        `leads/between/${lastTimestamp}/${timestamp}`,
      );
    },
    /**
     * Get data from Confection /leads/field/{field_name} Live API endpoint
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     * @returns {Promise<object>}
     */
    async getNewFieldValue(triggerField, lastTimestamp, timestamp) {
      return this.requestPaginatedData(
        `leads/field/${triggerField}/between/${lastTimestamp}/${timestamp}`,
      );
    },
    /**
     * Get data from Confection /leads/event/{event_name} Live API endpoint
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     * @returns {Promise<object>}
     */
    async getNewEvent(eventName, lastTimestamp, timestamp) {
      return this.requestPaginatedData(
        `leads/event/${eventName}/between/${lastTimestamp}/${timestamp}`,
      );
    },
  },
};
