import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dnsfilter",
  propDefinitions: {
    policyId: {
      type: "string",
      label: "Policy",
      description: "Identifier of a policy",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, links,
        } = await this.listPolicies(args);
        const options = data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
        return {
          options,
          context: {
            next: links?.next,
          },
        };
      },
    },
    networkId: {
      type: "string",
      label: "Network",
      description: "Identifier of a network",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, links,
        } = await this.listNetworks(args);
        const options = data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
        return {
          options,
          context: {
            next: links?.next,
          },
        };
      },
    },
    categoryId: {
      type: "string",
      label: "Category",
      description: "Identifier of a category",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          data, links,
        } = await this.listCategories(args);
        const options = data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
        return {
          options,
          context: {
            next: links?.next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dnsfilter.com/v1";
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherOpts,
      });
    },
    getNetwork({
      networkId, ...opts
    }) {
      return this._makeRequest({
        path: `/networks/${networkId}`,
        ...opts,
      });
    },
    listNetworks(opts = {}) {
      return this._makeRequest({
        path: "/networks",
        ...opts,
      });
    },
    listPolicies(opts = {}) {
      return this._makeRequest({
        path: "/policies",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/categories",
        ...opts,
      });
    },
    assignPolicyToSite({
      networkId, ...opts
    }) {
      return this._makeRequest({
        path: `/networks/${networkId}`,
        method: "PATCH",
        ...opts,
      });
    },
    blockCategoryFromPolicy({
      policyId, ...opts
    }) {
      return this._makeRequest({
        path: `/policies/${policyId}/add_blacklist_category`,
        method: "POST",
        ...opts,
      });
    },
    getTotalThreatsTrafficReport(opts = {}) {
      return this._makeRequest({
        path: "/traffic_reports/total_threats",
        ...opts,
      });
    },
  },
};
