import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gorgias",
  propDefinitions: {
    customerId: {
      type: "integer",
      label: "Customer ID",
      description: "The ID of a customer",
      async options({ prevContext }) {
        const {
          data: customers,
          meta,
        } = await this.listCustomers({
          cursor: prevContext.nextCursor,
        });
        return {
          options: customers.map((customer) => ({
            label: customer.email,
            value: customer.id,
          })),
          context: {
            nextCursor: meta.next_cursor,
          },
        };
      },
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number to return",
      optional: true,
    },
  },
  methods: {
    _auth() {
      return {
        username: `${this.$auth.email}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _defaultConfig({
      path, method = "get", params = {},
    }) {
      return {
        auth: this._auth(),
        url: `https://${this.$auth.domain}/api/${path}`,
        method,
        params,
      };
    },
    async _makeRequest({
      path, method, params,
    }) {
      const config = this._defaultConfig({
        path,
        method,
        params,
      });
      return axios(this, config);
    },
    async *paginate(fn, params = {}, cursor = undefined) {
      let n = 0;
      do {
        console.log(`run number ${++n}`);
        const {
          data,
          meta,
        } = await fn({
          ...params,
          cursor,
        });

        for (const d of data) {
          yield d;
        }

        cursor = meta.next_cursor;
      } while (cursor);
    },
    async getEvents(params) {
      return this._makeRequest({
        path: "/events",
        params,
      });
    },
    async listCustomers(params) {
      return this._makeRequest({
        path: "/customers",
        params,
      });
    },
    async listTickets(params) {
      return this._makeRequest({
        path: "/tickets",
        params,
      });
    },
  },
};
