import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "icypeas",
  propDefinitions: {
    domainOrCompany: {
      type: "string",
      label: "Domain Or Company",
      description: "The domain or the company name you want to scan.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The specific email to be verified.",
    },
    _id: {
      type: "string",
      label: "Search Instance ID",
      description: "The identifier of the specific search instance.",
      async options({ prevContext: { page } }) {
        const data = {
          next: true,
          limit: LIMIT,
        };
        if (page) {
          data.sorts = page;
        }
        const {
          items, sorts,
        } = await this.retrieveSingleSearchResult({
          data,
        });

        return {
          options: items.map(({
            _id: value, results,
          }) => ({
            label: results.emails[0]?.email || value,
            value,
          })),
          context: {
            page: sorts,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.icypeas.com/api";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    domainSearch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/domain-search",
        ...opts,
      });
    },
    verifyEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email-verification",
        ...opts,
      });
    },
    getMe() {
      return this._makeRequest({
        method: "POST",
        path: "/a/actions/subscription-information",
        data: {
          "email": this.$auth.email,
        },
      });
    },
    async retrieveSingleSearchResult({
      data, ...opts
    }) {
      const { userId } = await this.getMe();

      return this._makeRequest({
        method: "POST",
        path: "/bulk-single-searchs/read",
        data: {
          ...data,
          user: userId,
          mode: "single",
        },
        ...opts,
      });
    },
    async *paginate({
      fn, data = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = null;

      do {
        if (page) {
          data.sorts = page;
        }
        const {
          items,
          sorts,
        } = await fn({
          data,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }
        page = sorts;

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
