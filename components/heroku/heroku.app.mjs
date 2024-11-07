import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heroku",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of the app",
      async options() {
        const { data } = await this.listApps();
        return data.map((app) => ({
          label: app.name,
          value: app.id,
        }));
      },
    },
    entity: {
      type: "string[]",
      label: "Entity",
      description: "The entity to subscribe to",
      options: [
        "api:addon-attachment",
        "api:addon",
        "api:app",
        "api:build",
        "api:collaborator",
        "api:domain",
        "api:dyno",
        "api:formation",
        "api:release",
        "api:sni-endpoint",
      ],
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of events to subscribe to",
      options: [
        "create",
        "destroy",
        "update",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.heroku.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listApps() {
      return this._makeRequest({
        path: "/apps",
      });
    },
    async createWebhookSubscription(appId, entity) {
      return this._makeRequest({
        method: "POST",
        path: `/apps/${appId}/webhooks`,
        data: {
          include: entity,
          level: "notify",
          secret: "my_secret",
          url: "https://example.com/hooks",
          authorization: this.$auth.oauth_access_token,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
