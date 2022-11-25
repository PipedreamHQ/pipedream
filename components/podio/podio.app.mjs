import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "podio",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "An ID identifying the organization",
      async options() {
        const resp = await this.getOrgs();
        return resp.map((org) => ({
          label: org.name,
          value: org.org_id,
        }));
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "An ID identifying the space",
      async options({ orgId }) {
        const resp = await this.getSpaces({
          orgId,
        });
        return resp.map((space) => ({
          label: space.name,
          value: space.space_id,
        }));
      },
    },
    appId: {
      type: "string",
      label: "App ID",
      description: "An ID identifying the application",
      async options({ spaceId }) {
        const resp = await this.getApps({
          spaceId,
        });
        return resp.map((app) => ({
          label: app.url_label,
          value: app.app_id,
        }));
      },
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "An ID identifying the item",
      async options({
        page, appId,
      }) {
        const pageSize = 30;
        const resp = await this.filterItems({
          appId,
          params: {
            offset: page * pageSize,
            limit: pageSize,
          },
        });
        return resp.items.map((item) => ({
          label: item.title,
          value: item.item_id,
        }));
      },
    },
    reminder: {
      type: "integer",
      label: "Reminder",
      description: "Minutes to remind before the due date",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.podio.com${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($, config);
    },
    async getOrgs(args = {}) {
      return this._makeRequest({
        path: "/org",
        ...args,
      });
    },
    async getSpaces({
      orgId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/space/org/${orgId}`,
        ...args,
      });
    },
    async getApps({
      spaceId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/app/space/${spaceId}`,
        ...args,
      });
    },
    async getApp({
      appId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/app/${appId}`,
        ...args,
      });
    },
    async getItem({
      itemId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/item/${itemId}`,
        ...args,
      });
    },
    async getTask({
      taskId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        ...args,
      });
    },
    async getViews({
      appId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/view/app/${appId}`,
        ...args,
      });
    },
    async createWebhook({
      refType, refId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/hook/${refType}/${refId}`,
        ...args,
      });
    },
    async requestWebhookVerification({
      hookId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/hook/${hookId}/verify/request`,
        ...args,
      });
    },
    async validateWebhook({
      hookId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/hook/${hookId}/verify/validate`,
        ...args,
      });
    },
    async deleteWebhook({
      hookId, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hook/${hookId}`,
        ...args,
      });
    },
    async createItem({
      appId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/item/app/${appId}`,
        ...args,
      });
    },
    async updateItem({
      itemId, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/item/${itemId}`,
        ...args,
      });
    },
    async filterItems({
      appId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/item/app/${appId}/filter`,
        ...args,
      });
    },
    async createStatus({
      spaceId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/status/space/${spaceId}`,
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/task",
        ...args,
      });
    },
  },
};
