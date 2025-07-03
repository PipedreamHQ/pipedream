import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "appsflyer",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "Your AppsFlyer App ID (e.g. `com.my.app`).",
      async options() {
        const { data } = await this.listApps();
        return data.map(({
          id: value,
          attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path, baseUrl = constants.API.HQ1.BASE_URL) {
      return `${baseUrl}${path}`;
    },
    getHeaders() {
      const { api_token: apiToken } = this.$auth;
      return {
        Authorization: `Bearer ${apiToken}`,
      };
    },
    makeRequest({
      $ = this, path, baseUrl, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, baseUrl),
        headers: this.getHeaders(),
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "PUT",
        ...args,
      });
    },
    listApps(args = {}) {
      return this.makeRequest({
        baseUrl: constants.API.HQ1.MNG_URL,
        path: "/apps",
        ...args,
      });
    },
    getMessageFields({
      platform, ...args
    } = {}) {
      return this.makeRequest({
        baseUrl: constants.API.HQ1.PUSH_URL,
        path: `/fields/${platform}`,
        ...args,
      });
    },
    getEventTypes({
      attributingEntity, ...args
    } = {}) {
      return this.makeRequest({
        baseUrl: constants.API.HQ1.PUSH_URL,
        path: `/event-types/${attributingEntity}`,
        ...args,
      });
    },
    getPushApiConfiguration({
      appId, ...args
    } = {}) {
      return this.makeRequest({
        baseUrl: constants.API.HQ1.PUSH_URL,
        path: `/app/${appId}`,
        ...args,
      });
    },
    updatePushApiConfiguration({
      appId, ...args
    } = {}) {
      return this.put({
        baseUrl: constants.API.HQ1.PUSH_URL,
        path: `/app/${appId}`,
        ...args,
      });
    },
  },
};
