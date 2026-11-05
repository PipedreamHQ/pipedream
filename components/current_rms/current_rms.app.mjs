import { axios } from "@pipedream/platform";

const MAX_PER_PAGE = 100;

export default {
  type: "app",
  app: "current_rms",
  propDefinitions: {
    memberId: {
      type: "integer",
      label: "Member ID",
      description: "The ID of the member, e.g. `200`. Use **List Members** to find it (the `id` field).",
      async options({ page }) {
        const { members } = await this.listMembers({
          params: {
            page: page + 1,
            filtermode: "all",
          },
        });
        return members.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    opportunityId: {
      type: "integer",
      label: "Opportunity ID",
      description: "The ID of the opportunity, e.g. `1001`. Use **List Opportunities** to find it (the `id` field).",
      async options({ page }) {
        const { opportunities } = await this.listOpportunities({
          params: {
            page: page + 1,
            filtermode: "all",
          },
        });
        return opportunities.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    search: {
      type: "string",
      label: "Search",
      description: "Text to search for, e.g. `Conference`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most records to return, e.g. `50`. Defaults to `100`.",
      default: 100,
      min: 1,
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://api.current-rms.com/api/v1",
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "X-SUBDOMAIN": this.$auth.subdomain,
          ...headers,
        },
        ...args,
      });
    },
    /**
     * Fetch records across pages, up to a limit. Results are sorted by `id`, because the API
     * can lose records between pages when the order is not deterministic.
     * @param {object} opts
     * @param {function} opts.fn - The list method to call
     * @param {string} opts.resourceKey - The response field that holds the records
     * @param {object} [opts.params] - Query params sent with each request
     * @param {number} [opts.perPage=100] - The page size
     * @param {number} [opts.maxResults=100] - The most records to return
     * @returns {Promise<object[]>} The records
     */
    async paginate({
      fn, resourceKey, params, perPage = MAX_PER_PAGE, maxResults = 100, ...args
    }) {
      const records = [];
      let page = 1;
      let pageSize;
      do {
        const { [resourceKey]: pageRecords } = await fn.call(this, {
          ...args,
          params: {
            ...params,
            "q[s][]": "id asc",
            "page": page,
            "per_page": perPage,
          },
        });
        records.push(...pageRecords);
        pageSize = pageRecords.length;
        page += 1;
      } while (pageSize === perPage && records.length < maxResults);
      return records.slice(0, maxResults);
    },
    /**
     * Fetch one page of members.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `members`
     */
    listMembers(args = {}) {
      return this._makeRequest({
        url: "/members",
        ...args,
      });
    },
    /**
     * Fetch one member.
     * @param {object} opts
     * @param {number} opts.memberId - The member ID
     * @returns {Promise<object>} The response, with the record in `member`
     */
    getMember({
      memberId, ...args
    }) {
      return this._makeRequest({
        url: `/members/${memberId}`,
        ...args,
      });
    },
    /**
     * Fetch one page of opportunities.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `opportunities`
     */
    listOpportunities(args = {}) {
      return this._makeRequest({
        url: "/opportunities",
        ...args,
      });
    },
    /**
     * Fetch one opportunity.
     * @param {object} opts
     * @param {number} opts.opportunityId - The opportunity ID
     * @returns {Promise<object>} The response, with the record in `opportunity`
     */
    getOpportunity({
      opportunityId, ...args
    }) {
      return this._makeRequest({
        url: `/opportunities/${opportunityId}`,
        ...args,
      });
    },
    /**
     * Fetch one page of products.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `products`
     */
    listProducts(args = {}) {
      return this._makeRequest({
        url: "/products",
        ...args,
      });
    },
  },
};
