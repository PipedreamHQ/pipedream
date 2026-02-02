import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "videoask",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "ID of an organization",
      async options() {
        const { results } = await this.listOrganizations();
        return results?.map(({
          organization_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "ID of the form",
      async options({
        page, organizationId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const { results } = await this.listForms({
          organizationId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return results?.map(({
          form_id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.videoask.com";
    },
    _makeRequest({
      $ = this, path, organizationId, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "organization-id": organizationId,
        },
        ...opts,
      });
    },
    createWebhook({
      formId, tag, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/forms/${formId}/webhooks/${encodeURIComponent(tag)}`,
        ...opts,
      });
    },
    deleteWebhook({
      formId, tag, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/forms/${formId}/webhooks/${encodeURIComponent(tag)}`,
        ...opts,
      });
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    createForm(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms",
        ...opts,
      });
    },
    createQuestion(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/questions",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/respondents",
        ...opts,
      });
    },
  },
};
