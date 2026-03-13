import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "callingly",
  propDefinitions: {
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The ID of the lead",
      async options({
        page, params,
      }) {
        const leads = await this.listLeads({
          params: {
            ...params,
            page,
          },
        });
        return leads.map((lead) => ({
          label: `${lead.fname} ${lead.lname} (${lead.email})`,
          value: lead.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.callingly.com/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    updateLead({
      leadId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/leads/${leadId}`,
        ...opts,
      });
    },
    createClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
