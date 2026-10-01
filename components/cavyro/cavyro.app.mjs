import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cavyro",
  propDefinitions: {
    pipelineId: {
      type: "integer",
      label: "Pipeline",
      description: "The ID of the pipeline, e.g. `3`. Use **List Pipelines** to find it (the `id` field).",
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
      description: "The ID of a stage in the pipeline given in `pipelineId`, e.g. `41`. Use **Get Pipeline** to find it (the `id` field of an item in `stages`).",
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
      description: "The ID of the deal, e.g. `905`. Use **List Deals** to find it (the `id` field).",
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
      description: "The ID of the company to link, e.g. `318`. Use **List Companies** to find it (the `id` field).",
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
      description: "IDs of the contacts to link to the deal, e.g. `[4211, 4212]`. Use **Find Contact** to find them (the `id` field).",
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
      description: "User IDs of the workspace members to assign to the deal, e.g. `[7]`. Use **List Members** to find them (the `user_id` field, not `id`).",
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
      description: "The title of the deal, e.g. `Acme annual plan`.",
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
      description: "The date the deal is expected to close, in `YYYY-MM-DD` format, e.g. `2026-12-31`.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Free-form notes, e.g. `Met at the Belgrade SaaS meetup`.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field values keyed by custom field ID, e.g. `{\"12\": \"Enterprise\"}`. Use **List Custom Fields** to find the IDs (the `id` field) and which fields are `required`; required fields must be set here or the request fails.",
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
    listCustomFields(opts = {}) {
      return this._makeRequest({
        path: "/custom_field_definitions",
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
