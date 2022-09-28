import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default {
  propDefinitions: {
    postedAtStart: {
      type: "string",
      label: "Posted At Start",
      description: "Shows only transactions with a posted_at_date on or after this date-time. This parameter is the date-time notation as defined by [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6). Example: `2022-12-12T23:59:59.999`",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum amount of registered that will be fetched. Defaults to `500`.",
      default: 500,
      max: 1000,
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "User location",
      optional: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getLocations(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    department: {
      type: "string",
      label: "Departments",
      description: "User Department",
      optional: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getDepartments(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    user: {
      type: "string",
      label: "User",
      description: "User",
      optional: true,
      async options({ prevContext }) {
        const LIMIT = 100;
        const res = await this.getUsers(prevContext.cursor, LIMIT);
        return {
          options: res.data.items?.map((item) => ({
            label: `${item.first_name} ${item.last_name} <${item.email}>`,
            value: item.id,
          })),
          context: {
            cursor: res.data.next_cursor,
          },
        };
      },
    },
    cashAccount: {
      type: "string",
      label: "Cash Account",
      description: "Cash Account",
      optional: true,
      async options() {
        const res = await this.getCashAccounts();
        return res.data.items?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://platform.brexapis.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Idempotency-Key": uuidv4(),
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async _paginate(max, axiosParams) {
      const TOTAL_LIMIT = max || 500;
      const DEFAULT_LIMIT_PER_PAGE = 100;

      let items = [];
      let limit = Math.min(DEFAULT_LIMIT_PER_PAGE, parseInt(TOTAL_LIMIT));
      let cursor;
      do {
        // Adjust the limit to avoid extra elements on the last page
        if (items.length + limit > TOTAL_LIMIT) {
          limit -= items.length + limit - TOTAL_LIMIT;
        }
        const res = (await axios(this._getAxiosParams({
          ...axiosParams,
          params: {
            ...axiosParams.params,
            limit,
            cursor,
          },
        }))).data;

        if (res.items) {
          items = [
            ...items,
            ...res.items,
          ];
        }

        cursor = res.next_cursor;
      } while (items.length < TOTAL_LIMIT && cursor);

      return items;
    },
    async getLocations(cursor, limit) {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/v2/locations",
        params: {
          cursor,
          limit,
        },
      }));
    },
    async getDepartments(cursor, limit) {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/v2/departments",
        params: {
          cursor,
          limit,
        },
      }));
    },
    async getUsers(cursor, limit) {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/v2/users",
        params: {
          cursor,
          limit,
        },
      }));
    },
    async getCashAccounts() {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/v2/accounts/cash",
      }));
    },
  },
};
