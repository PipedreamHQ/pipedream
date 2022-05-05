import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
    address: {
      type: "string",
      label: "Address",
      description: "Actual address of the entry. Can be an email, facebook id, phone number, etc",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel used to send the message. Defaults to `email`",
      optional: true,
      default: "email",
      options: constants.channels,
    },
    via: {
      type: "string",
      label: "Via",
      description: "How the message has been received, or sent from Gorgias. Defaults to `help-center`",
      optional: true,
      default: "help-center",
      options: constants.vias,
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
      path, method = "get", params = {}, data = null,
    }) {
      const config = {
        auth: this._auth(),
        url: `https://${this.$auth.domain}/api/${path}`,
        headers: {
          "Content-type": "application/json",
        },
        method,
        params,
        data,
      };
      return config;
    },
    async _makeRequest({
      path, method, params, data,
    }) {
      const config = this._defaultConfig({
        path,
        method,
        params,
        data,
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
    async createTicket(data) {
      return this._makeRequest({
        path: "/tickets",
        method: "post",
        data,
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
