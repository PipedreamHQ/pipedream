import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "appointedd",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Filters the returned bookings by customer ID, returning only those that have a customer ID that matches the customer ID here.",
      optional: true,
      async options({ prevContext }) {
        const params = prevContext?.next
          ? {
            start: next,
          }
          : {};
        const {
          data, next,
        } = await this.listCustomers({
          params,
        });
        const options = data?.map(({
          id: value, profile,
        }) => ({
          value,
          label: `${profile.firstname} ${profile.lastname}`,
        })) || [];
        return {
          options,
          context: {
            next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.appointedd.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listBookings(opts = {}) {
      return this._makeRequest({
        path: "/bookings",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
      max,
    }) {
      let count = 0;
      let totalItems = 0;
      do {
        const {
          data, total, next,
        } = await resourceFn({
          params,
        });
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        params.start = next;
        totalItems = total;
      } while (count < totalItems);
    },
  },
};
