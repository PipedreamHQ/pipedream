import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dnsfilter",
  propDefinitions: {
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "The name of the organization to be created",
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the organization to be created",
      optional: true,
    },
    siteName: {
      type: "string",
      label: "Site Name",
      description: "The name of the site to which a policy should be assigned",
    },
    policyName: {
      type: "string",
      label: "Policy Name",
      description: "The name of the policy to be assigned to a site",
    },
    categoryName: {
      type: "string",
      label: "Category Name",
      description: "The name of the category to be blocked from a policy",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dnsfilter.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
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
    async createOrganization(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/organizations",
        method: "POST",
        data: {
          name: opts.organizationName,
          location: opts.location,
        },
      });
    },
    async assignPolicyToSite(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/sites/${opts.siteName}/policies/${opts.policyName}`,
        method: "PUT",
      });
    },
    async blockCategoryFromPolicy(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/policies/${opts.policyName}/categories/${opts.categoryName}`,
        method: "PUT",
        data: {
          action: "block",
        },
      });
    },
  },
};
