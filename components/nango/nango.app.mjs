import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "nango",
  propDefinitions: {
    providerConfigKey: {
      type: "string",
      label: "Provider Config Key",
      description: "The Provider Config Key of the Integration.",
    },
    oauthScopes: {
      type: "string[]",
      label: "OAuth Scopes",
      description: "The OAuth Scopes of the Integration.",
      options({
        provider, getDefaultScopes,
      }) {
        return getDefaultScopes(provider);
      },
    },
    connectionId: {
      type: "string",
      label: "Connection ID",
      description: "The Connection ID of the Integration.",
      async options() {
        const { connections } = await this.listConnections();
        return connections.map(({
          connection_id: value, provider: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.nango_secret_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listIntegrations(args = {}) {
      return this.makeRequest({
        path: "/config",
        ...args,
      });
    },
    listConnections(args = {}) {
      return this.makeRequest({
        path: "/connection",
        ...args,
      });
    },
  },
};
