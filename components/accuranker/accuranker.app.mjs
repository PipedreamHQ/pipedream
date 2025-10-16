import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "accuranker",
  propDefinitions: {
    domainId: {
      type: "string",
      label: "Domain ID",
      description: "The ID of the domain",
      async options({ page }) {
        const { results: domains } = await this.listDomains({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
            fields: "id,domain",
          },
        });
        return domains?.map((domain) => ({
          label: domain.domain,
          value: domain.id,
        })) || [];
      },
    },
    keywordId: {
      type: "string",
      label: "Keyword ID",
      description: "The ID of the keyword",
      async options({
        domainId, page,
      }) {
        const { results: keywords } = await this.listKeywords({
          domainId,
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
            fields: "id,keyword",
          },
        });
        return keywords?.map((keyword) => ({
          label: keyword.keyword,
          value: keyword.id,
        })) || [];
      },
    },
    periodFrom: {
      type: "string",
      label: "Period From",
      description: "Date in format: YYYY-MM-DD",
      optional: true,
    },
    periodTo: {
      type: "string",
      label: "Period To",
      description: "Date in format: YYYY-MM-DD",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.accuranker.com/api/v4";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        path: "/domains/",
        ...opts,
      });
    },
    listKeywords({
      domainId, ...opts
    }) {
      return this._makeRequest({
        path: `/domains/${domainId}/keywords/`,
        ...opts,
      });
    },
    listBrands(opts = {}) {
      return this._makeRequest({
        path: "/brands/",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
        },
      };

      let total, count = 0;
      do {
        const { results } = await fn(args);
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return count;
          }
        }
        total = results?.length;
        args.params.offset += DEFAULT_LIMIT;
      } while (total === DEFAULT_LIMIT);
    },
  },
};
