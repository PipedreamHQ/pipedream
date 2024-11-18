import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "heroku",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of the app",
      async options() {
        const apps = await this.listApps();
        return apps?.map((app) => ({
          label: app.name,
          value: app.id,
        })) || [];
      },
    },
    entities: {
      type: "string[]",
      label: "Entities",
      description: "The entity or entities to subscribe to",
      options: constants.ENTITIES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.heroku.com";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          Accept: "application/vnd.heroku+json; version=3",
        },
      });
    },
    listApps(opts = {}) {
      return this._makeRequest({
        path: "/apps",
        ...opts,
      });
    },
    createWebhookSubscription({
      appId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/apps/${appId}/webhooks`,
        ...opts,
      });
    },
    deleteWebhookSubscription({
      appId, hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/apps/${appId}/webhooks/${hookId}`,
        ...opts,
      });
    },
  },
};
