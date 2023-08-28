import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pushcut",
  propDefinitions: {
    notification: {
      type: "string",
      label: "Notification",
      description: "Name of the notification",
      async options() {
        const notifications = await this.listNotifications();
        return notifications?.map(({ id }) => id ) || [];
      },
    },
    shortcut: {
      type: "string",
      label: "Shortcut",
      description: "Name of the shortcut",
      async options() {
        const shortcuts = await this.listShortcuts();
        return shortcuts?.map(({ id }) => id ) || [];
      },
    },
    homekitScene: {
      type: "string",
      label: "Homekit Scene",
      description: "Name of the homekit scene",
      async options() {
        const scenes = await this.listHomekitScenes();
        return scenes?.map(({ id }) => id ) || [];
      },
    },
    timeout: {
      type: "string",
      label: "Timeout",
      description: "Timeout in seconds, or 'nowait'",
      optional: true,
      default: "nowait",
    },
    delay: {
      type: "string",
      label: "Delay",
      description: "Duration in which this request should be executed. Eg: 10s, 15m, 6h",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pushcut.io/v1";
    },
    _headers() {
      return {
        "API-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listNotifications(args = {}) {
      return this._makeRequest({
        path: "/notifications",
        ...args,
      });
    },
    listShortcuts(args = {}) {
      return this._makeRequest({
        path: "/shortcuts",
        ...args,
      });
    },
    listHomekitScenes(args = {}) {
      return this._makeRequest({
        path: "/scenes",
        ...args,
      });
    },
    executeAction(args = {}) {
      return this._makeRequest({
        path: "/execute",
        method: "POST",
        ...args,
      });
    },
    sendNotification({
      notification, ...args
    }) {
      return this._makeRequest({
        path: `/notifications/${notification}`,
        method: "POST",
        ...args,
      });
    },
  },
};
