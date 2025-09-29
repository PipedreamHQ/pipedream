import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "godaddy",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "A domain name",
      async options({ prevContext }) {
        const domains = await this.listDomains({
          params: {
            marker: prevContext?.marker,
          },
        });
        const options = domains.map((domain) => domain.domain);
        return {
          options,
          context: {
            marker: options.length > 0
              ? options[options.length - 1]
              : undefined,
          },
        };
      },
    },
    tlds: {
      type: "string[]",
      label: "TLDs",
      description: "Top-level domains to be included in suggestions",
      optional: true,
      async options() {
        const tlds = await this.listTlds();
        return tlds.map((tld) => tld.name);
      },
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter by status",
      options: constants.DOMAIN_STATUSES,
      optional: true,
    },
    statusGroups: {
      type: "string[]",
      label: "Status Groups",
      description: "Filter by status group",
      options: constants.STATUS_GROUPS,
      optional: true,
    },
    includes: {
      type: "string[]",
      label: "Includes",
      description: "Optional details to be included in the response",
      options: constants.DOMAIN_DETAIL_FIELDS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/v1`;
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `sso-key ${this.$auth.api_key}:${this.$auth.api_secret}`,
        },
        ...opts,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        path: "/domains",
        ...opts,
      });
    },
    listTlds(opts = {}) {
      return this._makeRequest({
        path: "/domains/tlds",
        ...opts,
      });
    },
    checkDomainAvailability(opts = {}) {
      return this._makeRequest({
        path: "/domains/available",
        ...opts,
      });
    },
    renewDomain({
      domain, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/domains/${domain}/renew`,
        ...opts,
      });
    },
    suggestDomains(opts = {}) {
      return this._makeRequest({
        path: "/domains/suggest",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, max,
    }) {
      params = {
        ...params,
        limit: 100,
      };
      let total, count = 0;
      do {
        const results = await fn({
          params,
        });
        if (!results?.length) {
          return;
        }
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = results?.length;
        params.marker = results[results.length - 1].domain;
      } while (total === params.limit);
    },
  },
};
