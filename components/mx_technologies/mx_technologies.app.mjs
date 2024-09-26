import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mx_technologies",
  propDefinitions: {
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional information you can store about this user. MX recommends using JSON-structured data.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for a user.",
      async options({ page }) {
        const { users } = await this.listUsers({
          params: {
            page,
          },
        });

        return users.map(({
          guid: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://int-api.mx.com";
    },
    _headers() {
      return {
        "Accept": "application/vnd.mx.api.v20231004+json",
      };
    },
    _auth() {
      return {
        username: `${this.$auth.client_id}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        auth: this._auth(),
        ...opts,
      });
    },
    createManualAccount({
      userGuid, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userGuid}/accounts`,
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {},
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.page = ++page;
        const {
          users,
          pagination: {
            current_page,
            total_pages,
          },
        } = await fn({
          params,
        });
        for (const d of users) {
          yield d;
        }

        hasMore = !(current_page == total_pages);

      } while (hasMore);
    },
  },
};
