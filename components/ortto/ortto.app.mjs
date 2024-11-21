import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ortto",
  propDefinitions: {
    recordType: {
      type: "string",
      label: "Record Type",
      description: "Choose between 'person' or 'organization'",
      options: [
        "person",
        "organization",
      ],
    },
    data: {
      type: "object",
      label: "Record Data",
      description: "Data of the record to initialize or update.",
    },
    activityName: {
      type: "string",
      label: "Activity Name",
      description: "Specify the activity to be created.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Optional: Assign the activity to a preexisting record",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Specify the user ID to opt out from all SMS communications.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ap3api.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitContactCreated(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/person/create",
        ...opts,
      });
    },
    async emitOrganizationCreated(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/organizations/create",
        ...opts,
      });
    },
    async emitContactUpdated(opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "/v1/person/update",
        ...opts,
      });
    },
    async emitOrganizationUpdated(opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "/v1/organizations/update",
        ...opts,
      });
    },
    async createUniqueActivity(opts = {}) {
      const {
        activityName, recordId, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v1/activities/create",
        data: {
          activityName: this.activityName,
          recordId: this.recordId,
          ...otherOpts,
        },
      });
    },
    async optOutSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/persons/${this.userId}/sms-opt-out`,
        ...opts,
      });
    },
    async initializeOrUpdateRecord(opts = {}) {
      const {
        recordType, data, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/v1/${recordType}s/merge`,
        data: {
          [recordType]: [
            data,
          ],
          async: true,
          ...otherOpts,
        },
      });
    },
    async getNewContacts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/persons/get",
        params: {
          sort_order: "asc",
          sort_by_field_id: "created_at",
          limit: 50,
        },
        ...opts,
      });
    },
    async getNewOrganizations(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/v1/organizations/get",
        params: {
          sort_order: "asc",
          sort_by_field_id: "created_at",
          limit: 50,
        },
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response = await fn(...opts);
      results = results.concat(response.items);

      while (response.has_more) {
        const nextOpts = {
          ...opts,
          cursor_id: response.cursor_id,
        };
        response = await fn(...nextOpts);
        results = results.concat(response.items);
      }

      return results;
    },
  },
};
