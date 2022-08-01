import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nocrm_io",
  propDefinitions: {
    leadId: {
      label: "Lead ID",
      description: "The ID of the lead",
      type: "string",
      async options({ page }) {
        const leads = await this.getLeads({
          params: {
            limit: 100,
            offset: 100 * page,
          },
        });

        return leads.map((lead) => ({
          label: lead.title,
          value: lead.id,
        }));
      },
    },
    userId: {
      label: "User ID",
      description: "The ID of the user",
      type: "string",
      async options() {
        const users = await this.getUsers();

        return users.map((user) => ({
          label: user.firstname + (user.lastname
            ? " " + user.lastname
            : ""),
          value: user.id,
        }));
      },
    },
    stepId: {
      label: "Step ID",
      description: "The ID of the step",
      type: "string",
      async options() {
        const steps = await this.getSteps();

        return steps.map((step) => ({
          label: step.name,
          value: step.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _subdomain() {
      return this.$auth.subdomain;
    },
    _apiUrl() {
      return `https://${this._subdomain()}.nocrm.io/api/v2`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "X-API-KEY": this._apiKey(),
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook({ webhookId }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "delete",
      });
    },
    async getSteps({ ...args }) {
      return this._makeRequest({
        path: "/steps",
        ...args,
      });
    },
    async getUsers({ ...args }) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getLeads({ ...args }) {
      return this._makeRequest({
        path: "/leads",
        ...args,
      });
    },
    async getLead({
      leadId, ...args
    }) {
      return this._makeRequest({
        path: `/leads/${leadId}`,
        ...args,
      });
    },
    async createLead({ ...args }) {
      return this._makeRequest({
        path: "/leads",
        method: "post",
        ...args,
      });
    },
    async updateLead({
      leadId, ...args
    }) {
      return this._makeRequest({
        path: `/leads/${leadId}`,
        method: "put",
        ...args,
      });
    },
  },
};
