import axios from "axios";

export default {
  type: "app",
  app: "close",
  propDefinitions: {
    statusId: {
      label: "Status ID",
      description: "Lead Statuses represent a Lead's current relationship to your company. [See the docs](https://help.close.com/docs/lead-statuses)",
      type: "string",
      optional: true,
      async options() {
        const status = await this.listLeadStatus();
        return status.data.data.map((l) => ({
          label: l.label,
          value: l.id,
        }));
      },
    },
    moreFields: {
      label: "More Fields",
      description: "Additional properties not listed as a prop",
      type: "object",
      optional: true,
    },
    lead: {
      label: "Lead ID",
      description: "Lead to be selected",
      type: "string",
      async options({ page = 0 }) {
        const _limit = 50;
        const leads = await this.listLeads({
          params: {
            _skip: _limit * page,
            _limit,
            _fields: "id,display_name",
          },
        });
        return leads.data.data.map((l) => ({
          label: l.display_name,
          value: l.id,
        }));
      },
    },
  },
  methods: {
    _getAuthKeys() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _getUrl(path) {
      return `https://api.close.com/api/v1${path}`;
    },
    _getHeaders() {
      return {
        "accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        auth: this._getAuthKeys(),
        ...otherConfig,
      };
      return axios(config);
    },
    async createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...args,
      });
    },
    async deleteHook({
      hookId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook/${hookId}`,
        ...args,
      });
    },
    async listLeads(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/lead",
        ...args,
      });
    },
    async listLeadStatus(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/status/lead",
        ...args,
      });
    },
    async createLead(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/lead",
        ...args,
      });
    },
    async updateLead({
      leadId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/lead/${leadId}`,
        ...args,
      });
    },
    async searchLeads(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/data/search/",
        ...args,
      });
    },
  },
};
