import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kommo",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company Id",
      description: "Identifier of the contact to be updated.",
      async options({ page }) {
        const response = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        if (!response) return [];

        const { _embedded: { companies } } = response;

        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "Identifier of the contact to be updated.",
      async options({ page }) {
        const response = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        if (!response) return [];

        const { _embedded: { contacts } } = response;

        return contacts.map(({
          id: value, name, first_name: fname, last_name: lname,
        }) => ({
          label: `${name || `${fname} ${lname}`}`,
          value,
        }));
      },
    },
    pipelineId: {
      type: "string",
      label: "Pipeline Id",
      description: "Pipeline ID the lead is added to.",
      async options({ page }) {
        const response = await this.listPipelines({
          params: {
            page: page + 1,
          },
        });
        if (!response) return [];

        const { _embedded: { pipelines } } = response;

        return pipelines.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "Responsible User Id",
      description: "Contact responsible user Id.",
      async options({ pipelineId }) {
        const response = await this.listUsers({
          pipelineId,
        });
        if (!response) return [];

        const { _embedded: { users } } = response;

        return users.map(({
          id: value, name, email,
        }) => ({
          label: `${name || email}`,
          value,
        }));
      },
    },
    statusId: {
      type: "string",
      label: "Status Id",
      description: "Stage ID the lead is added to. The first stage of the main pipeline by default.",
      async options({ pipelineId }) {
        const response = await this.listStatuses({
          pipelineId,
        });
        if (!response) return [];

        const { _embedded: { statuses } } = response;

        return statuses.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customFieldsValues: {
      type: "string[]",
      label: "Custom Fields Values",
      description: "An array of objects of custom fields' values. [Examples of custom fields structure](https://www.kommo.com/developers/content/api_v4/custom-fields/#cf-fill-examples)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.kommo.com/api/v4`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path = "", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listPipelines(opts = {}) {
      return this._makeRequest({
        path: "/leads/pipelines",
        ...opts,
      });
    },
    listStatuses({
      pipelineId, ...opts
    }) {
      return this._makeRequest({
        path: `/leads/pipelines/${pipelineId}/statuses`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/companies",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhooks",
        ...opts,
      });
    },
  },
};
