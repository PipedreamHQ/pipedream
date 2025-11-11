import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adversus",
  propDefinitions: {
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The ID of the lead",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the lead status",
    },
  },
  methods: {
    /**
     * Get authentication credentials for API requests
     * @returns {Object} Authentication object with username and password
     */
    _auth() {
      return {
        username: this.$auth.username,
        password: this.$auth.password,
      };
    },
    /**
     * Get the base URL for Adversus API
     * @returns {string} Base API URL
     */
    _baseUrl() {
      return "https://solutions.adversus.io/api";
    },
    /**
     * Make an HTTP request to the Adversus API
     * @param {Object} opts - Request options
     * @param {Object} opts.$ - Pipedream context
     * @param {string} opts.path - API endpoint path
     * @param {string} [opts.method="GET"] - HTTP method
     * @param {...Object} opts - Additional axios options
     * @returns {Promise} API response
     */
    async _makeRequest({
      $ = this, path, method = "GET", ...opts
    }) {
      return axios($, {
        method,
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    /**
     * Create a new lead in Adversus
     * @param {Object} opts - Request options including data payload
     * @returns {Promise} The created lead response
     */
    async createLead(opts) {
      return this._makeRequest({
        path: "/leads",
        method: "POST",
        ...opts,
      });
    },
    /**
     * Update an existing lead in Adversus
     * @param {string} leadId - The ID of the lead to update
     * @param {Object} opts - Request options including data payload
     * @returns {Promise} The updated lead response
     */
    async updateLead(leadId, opts) {
      return this._makeRequest({
        path: `/leads/${leadId}`,
        method: "PUT",
        ...opts,
      });
    },
    /**
     * Add a note to a lead in Adversus
     * @param {string} leadId - The ID of the lead
     * @param {Object} opts - Request options including note data
     * @returns {Promise} The response from adding the note
     */
    async addNoteToLead(leadId, opts) {
      return this._makeRequest({
        path: `/leads/${leadId}/notes`,
        method: "POST",
        ...opts,
      });
    },
    /**
     * Add an activity to a lead in Adversus
     * @param {string} leadId - The ID of the lead
     * @param {Object} opts - Request options including activity data
     * @returns {Promise} The response from adding the activity
     */
    async addActivityToLead(leadId, opts) {
      return this._makeRequest({
        path: `/leads/${leadId}/activities`,
        method: "POST",
        ...opts,
      });
    },
    /**
     * Change the status of a lead in Adversus
     * @param {string} leadId - The ID of the lead
     * @param {string} statusId - The ID of the new status
     * @param {Object} [opts={}] - Additional request options
     * @returns {Promise} The response from changing the status
     */
    async changeLeadStatus(leadId, statusId, opts = {}) {
      const {
        data: optsData, ...restOpts
      } = opts;
      return this._makeRequest({
        path: `/leads/${leadId}/status`,
        method: "PUT",
        data: {
          statusId,
          ...(optsData || {}),
        },
        ...restOpts,
      });
    },
    /**
     * Assign a lead to a campaign in Adversus
     * @param {string} leadId - The ID of the lead
     * @param {string} campaignId - The ID of the campaign
     * @param {Object} [opts={}] - Additional request options
     * @returns {Promise} The response from assigning the lead
     */
    async assignLeadToCampaign(leadId, campaignId, opts = {}) {
      const {
        data: optsData, ...restOpts
      } = opts;
      return this._makeRequest({
        path: `/leads/${leadId}/campaign`,
        method: "PUT",
        data: {
          campaignId,
          ...(optsData || {}),
        },
        ...restOpts,
      });
    },
  },
};
