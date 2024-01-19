import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airslate",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to modify",
    },
    organizationRequestBody: {
      type: "object",
      label: "Organization Request Body",
      description: "The request body to create a new organization with specific settings. Leave empty for default settings.",
      optional: true,
    },
    templateRequestBody: {
      type: "object",
      label: "Template Request Body",
      description: "The request body to create or modify a template.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airslate.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createOrganization({ body = {} }) {
      return this._makeRequest({
        method: "POST",
        path: "/organizations",
        data: body,
      });
    },
    async createTemplate({
      organizationId, body,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/organizations/${organizationId}/templates`,
        data: body,
      });
    },
    async modifyTemplate({
      templateId, body,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/templates/${templateId}`,
        data: body,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
