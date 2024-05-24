import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "upstash_redis",
  propDefinitions: {
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "The ID of the database.",
      async options() {
        const databases = await this.listDatabases();
        return databases.map(({
          database_id: value, database_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getRedisUrl() {
      const { upstash_redis_rest_url: url } = this.$auth;
      return url.startsWith(constants.HTTPS_PROTOCOL)
        ? url
        : `${constants.HTTPS_PROTOCOL}${url}`;
    },
    getUrl(path, managementApi) {
      return managementApi
        ? `${constants.BASE_URL}${constants.VERSION_PATH}${path}`
        : this.getRedisUrl();
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.uptash_redis_rest_token}`,
      };
    },
    getAuth(managementApi) {
      if (managementApi) {
        const {
          email: username,
          management_api_key: password,
        } = this.$auth;
        return {
          username,
          password,
        };
      }
    },
    _makeRequest({
      $ = this, path, headers, managementApi, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, managementApi),
        headers: this.getHeaders(headers),
        auth: this.getAuth(managementApi),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listDatabases() {
      return this._makeRequest({
        managementApi: true,
        path: "/databases",
      });
    },
  },
};
