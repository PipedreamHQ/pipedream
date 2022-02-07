import axios from "axios";

export default {
  type: "app",
  app: "brex_staging",
  propDefinitions: {
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
  },
  methods: {
    _getBaseUrl() {
      return "https://platform.staging.brexapps.com/v2";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
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
    async getLocations(cursor, limit) {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/locations",
        params: {
          cursor,
          limit,
        },
      }));
    },
    async getDepartments(cursor, limit) {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/departments",
        params: {
          cursor,
          limit,
        },
      }));
    },
    async getUsers(cursor, limit) {
      return axios(this._getAxiosParams({
        method: "GET",
        path: "/users",
        params: {
          cursor,
          limit,
        },
      }));
    },
  },
};
