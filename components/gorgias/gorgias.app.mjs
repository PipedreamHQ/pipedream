import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gorgias",
  propDefinitions: {},
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
  },
};
