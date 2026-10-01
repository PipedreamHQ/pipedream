import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cavyro",
  propDefinitions: {
    pipelineId: {
      type: "integer",
      label: "Pipeline",
      description: "The pipeline the deal belongs to.",
      async options({ page }) {
        const pipelines = await this.listPipelines({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return pipelines.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    stageId: {
      type: "integer",
      label: "Stage",
      description: "The pipeline stage for the deal.",
      async options({ pipelineId }) {
        if (!pipelineId) {
          return [];
        }
        const { stages = [] } = await this.getPipeline({
          pipelineId,
        });
        return stages.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    dealId: {
      type: "integer",
      label: "Deal",
      description: "The deal to act on.",
      async options({ page }) {
        const deals = await this.listDeals({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return deals.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyId: {
      type: "integer",
      label: "Company",
      description: "The company to link.",
      optional: true,
      async options({ page }) {
        const companies = await this.listCompanies({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactIds: {
      type: "integer[]",
      label: "Contacts",
      description: "The contacts to link to the deal.",
      optional: true,
      async options({ page }) {
        const contacts = await this.listContacts({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return contacts.map(({
          id: value, full_name: fullName, email,
        }) => ({
          label: email
            ? `${fullName} (${email})`
            : fullName,
          value,
        }));
      },
    },
    assigneeIds: {
      type: "integer[]",
      label: "Assignees",
      description: "Workspace members to assign to the deal.",
      optional: true,
      async options({ page }) {
        const members = await this.listMembers({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return members.map(({
          user_id: value, display_name: displayName, email,
        }) => ({
          label: displayName || email,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the deal.",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The monetary value of the deal, e.g. `2500` or `1999.99`.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code, e.g. `EUR`. Defaults to the workspace currency.",
      optional: true,
    },
    expectedCloseDate: {
      type: "string",
      label: "Expected Close Date",
      description: "The date the deal is expected to close, in `YYYY-MM-DD` format.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Free-form notes.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field values keyed by custom field ID, e.g. `{\"12\": \"Enterprise\"}`. Required custom fields in your workspace must be set here.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cavyro.com/api/v1";
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "X-Workspace-Id": this.$auth.workspace_id,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    getMe(opts = {}) {
      return this._makeRequest({
        path: "/me",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    linkContactToCompany({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/companies`,
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies",
        ...opts,
      });
    },
    listPipelines(opts = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...opts,
      });
    },
    getPipeline({
      pipelineId, ...opts
    }) {
      return this._makeRequest({
        path: `/pipelines/${pipelineId}`,
        params: {
          include_deals: false,
        },
        ...opts,
      });
    },
    listDeals(opts = {}) {
      return this._makeRequest({
        path: "/deals",
        ...opts,
      });
    },
    createDeal({
      pipelineId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/pipelines/${pipelineId}/deals`,
        ...opts,
      });
    },
    updateDeal({
      dealId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/deals/${dealId}`,
        ...opts,
      });
    },
    moveDeal({
      dealId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/deals/${dealId}/move`,
        ...opts,
      });
    },
    listMembers(opts = {}) {
      return this._makeRequest({
        path: "/members",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook_subscriptions",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook_subscriptions/${webhookId}`,
        ...opts,
      });
    },
  },
};
