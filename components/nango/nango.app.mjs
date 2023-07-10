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
      async options() {
        const { configs } = await this.listIntegrations();
        return configs.map(({ unique_key: value }) => value);
      },
    },
    oauthScopes: {
      type: "string[]",
      label: "OAuth Scopes",
      description: "The OAuth Scopes of the Integration. The list of scope should be found in the documentation of the external provider.",
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
    anyPath: {
      type: "string",
      label: "Path",
      description: "The Path of the Request.",
    },
    retries: {
      type: "integer",
      label: "Retries",
      description: "The number of times to retry the request.",
      optional: true,
    },
    baseUrlOverride: {
      type: "string",
      label: "Base URL Override",
      description: "The Base URL Override of the request.",
      optional: true,
    },
    anyQueryParams: {
      type: "object",
      label: "Any Body Params",
      description: "The Any Body Params of the request.",
      optional: true,
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
    listRecords(args = {}) {
      return this.makeRequest({
        path: "/sync/records",
        ...args,
      });
    },
  },
};
