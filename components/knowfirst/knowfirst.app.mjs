import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "knowfirst",
  propDefinitions: {
    businessId: {
      type: "string",
      label: "Business ID",
      description: "The ID of a business",
      async options({
        prevContext, query, tracked = false,
      }) {
        const params = {
          next_token: prevContext?.nextToken,
          q: query,
        };
        const {
          endpoint, list,
        } = tracked
          ? await this.listTrackedBusinesses({
            params,
          })
          : await this.listBusinesses({
            params,
          });
        const next = endpoint?.next_token;
        const options = list.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
        return {
          options,
          context: {
            nextToken: next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.knowfirst.ai/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listBusinesses(opts = {}) {
      return this._makeRequest({
        path: "/business/list",
        ...opts,
      });
    },
    listTrackedBusinesses(opts = {}) {
      return this._makeRequest({
        path: "/business/tracking",
        ...opts,
      });
    },
    getFeed(opts = {}) {
      return this._makeRequest({
        path: "/feed",
        ...opts,
      });
    },
    startTrackingBusiness({
      businessId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/business/tracking/${businessId}`,
        ...opts,
      });
    },
    stopTrackingBusiness({
      businessId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/business/tracking/${businessId}`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
      max,
    }) {
      let next, count = 0;
      do {
        const {
          events: {
            endpoint, list,
          },
        } = await resourceFn({
          params,
        });
        for (const item of list) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        next = endpoint?.next_token;
        params = {
          next_token: next,
        };
      } while (next);
    },
  },
};
