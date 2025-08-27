import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "viewdns_info",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.viewdns.info";
    },
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          apikey: `${this.$auth.api_key}`,
          output: "json",
        },
        ...opts,
      });
    },
    whoisLookup(opts = {}) {
      return this._makeRequest({
        path: "/whois/v2",
        ...opts,
      });
    },
    reverseWhoisLookup(opts = {}) {
      return this._makeRequest({
        path: "/reversewhois/",
        ...opts,
      });
    },
    subdomainDiscovery(opts = {}) {
      return this._makeRequest({
        path: "/subdomains/",
        ...opts,
      });
    },
    reverseIpLookup(opts = {}) {
      return this._makeRequest({
        path: "/reverseip/",
        ...opts,
      });
    },
    ipHistory(opts = {}) {
      return this._makeRequest({
        path: "/iphistory/",
        ...opts,
      });
    },
    dnsLookup(opts = {}) {
      return this._makeRequest({
        path: "/dnsrecord/",
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
        },
      };
      let totalPages, count = 0;
      do {
        const { response } = await fn(args);
        const items = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        totalPages = +response.total_pages;
        args.params.page++;
      } while (totalPages > args.params.page);
    },
    async getPaginatedResources(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
