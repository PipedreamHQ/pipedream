import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "marketo",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form",
      async options({ page }) {
        const { result = [] } = await this.listForms({
          params: {
            maxReturn: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return result.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    programId: {
      type: "string",
      label: "Program ID",
      description: "The ID of the program",
      async options({ page }) {
        const { result = [] } = await this.listPrograms({
          params: {
            maxReturn: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return result.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The ID of the lead",
      async options({ page }) {
        const { result = [] } = await this.getLeads({
          params: {
            batchSize: constants.DEFAULT_LIMIT,
            nextPageToken: page > 0
              ? this._getNextPageToken()
              : undefined,
          },
        });
        if (result.length) {
          this._setNextPageToken(result[result.length - 1].id);
        }
        return result.map(({
          id: value, email, firstName, lastName,
        }) => ({
          value,
          label: `${firstName || ""} ${lastName || ""} (${email})`.trim(),
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options({ page }) {
        const { result = [] } = await this.getLists({
          params: {
            maxReturn: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return result.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to return for the lead",
      optional: true,
      async options() {
        const { result = [] } = await this.describeLeadFields();
        return result.map(({ rest: { name: value } }) => value);
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${this.$auth.endpoint}/rest`;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _getNextPageToken() {
      return this.db?.get("nextPageToken");
    },
    _setNextPageToken(token) {
      this.db?.set("nextPageToken", token);
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...opts,
      });
    },
    async getAccessToken({ $ }) {
      const { endpoint } = this.$auth;
      const response = await axios($, {
        url: `${constants.BASE_URL}${endpoint}/identity/oauth/token`,
        params: {
          grant_type: "client_credentials",
          client_id: this.$auth.client_id,
          client_secret: this.$auth.client_secret,
        },
      });
      return response.access_token;
    },
    async listForms(opts = {}) {
      return this._makeRequest({
        path: "/asset/v1/forms.json",
        ...opts,
      });
    },
    async getForm({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/asset/v1/form/${formId}.json`,
        ...opts,
      });
    },
    async getFormFields({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/asset/v1/form/${formId}/fields.json`,
        ...opts,
      });
    },
    async listPrograms(opts = {}) {
      return this._makeRequest({
        path: "/asset/v1/programs.json",
        ...opts,
      });
    },
    async getProgram({
      programId, ...opts
    }) {
      return this._makeRequest({
        path: `/asset/v1/program/${programId}.json`,
        ...opts,
      });
    },
    async createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/leads.json",
        ...opts,
      });
    },
    async updateLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/leads.json",
        ...opts,
      });
    },
    async getLead({
      leadId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/lead/${leadId}.json`,
        ...opts,
      });
    },
    async getLeads(opts = {}) {
      return this._makeRequest({
        path: "/v1/leads.json",
        ...opts,
      });
    },
    async getLeadsByFilterType({
      filterType, filterValues, fields, ...opts
    }) {
      return this._makeRequest({
        path: "/v1/leads.json",
        params: {
          filterType,
          filterValues: filterValues.join(","),
          fields: fields?.join(","),
        },
        ...opts,
      });
    },
    async addLeadsToList({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/lists/${listId}/leads.json`,
        ...opts,
      });
    },
    async getLists(opts = {}) {
      return this._makeRequest({
        path: "/v1/lists.json",
        ...opts,
      });
    },
    async describeLeadFields(opts = {}) {
      return this._makeRequest({
        path: "/v1/leads/describe.json",
        ...opts,
      });
    },
    async getActivities({
      activityTypeIds, nextPageToken, ...opts
    }) {
      return this._makeRequest({
        path: "/v1/activities.json",
        params: {
          activityTypeIds: activityTypeIds?.join(","),
          nextPageToken,
        },
        ...opts,
      });
    },
    async getPagingToken({
      sinceDatetime, ...opts
    }) {
      return this._makeRequest({
        path: "/v1/activities/pagingtoken.json",
        params: {
          sinceDatetime,
        },
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let count = 0;
      let nextPageToken;

      do {
        const {
          result = [],
          nextPageToken: token,
        } = await fn({
          params: {
            ...params,
            nextPageToken,
          },
        });

        for (const item of result) {
          yield item;

          if (maxResults && ++count >= maxResults) {
            return;
          }
        }

        nextPageToken = token;

      } while (nextPageToken);
    },
  },
};
