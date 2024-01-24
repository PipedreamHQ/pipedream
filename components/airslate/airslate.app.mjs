import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "airslate",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const { data: resources } = await this.getOrganizations();

        return resources.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to modify",
      async options({ organizationId }) {
        const { data: resources } = await this.getTemplates({
          organizationId,
        });

        return resources.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "Template description",
      optional: true,
    },
    redirectUrl: {
      type: "string",
      label: "Redirect URL",
      description: "The URL where recipients will be redirected after completing documents",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Organization name",
    },
    subdomain: {
      type: "string",
      label: "Subdomain",
      description: "Organization subdomain. The subdomain must be unique. Use English letters, numbers, and dashes only.",
    },
    category: {
      type: "string",
      label: "Category",
      description: "Organization category",
      options: constants.ORGANIZATION_CATEGORIES,
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "Organization size",
      options: constants.COMPANY_SIZE,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airslate.io/v1";
    },
    _makeRequest(opts = {}) {
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
    createOrganization(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/organizations",
        ...args,
      });
    },
    getOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    createTemplate({
      organizationId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/organizations/${organizationId}/templates`,
        ...args,
      });
    },
    modifyTemplate({
      organizationId, templateId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/organizations/${organizationId}/templates/${templateId}`,
        ...args,
      });
    },
    getTemplates({
      organizationId, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/templates`,
        ...args,
      });
    },
  },
};
