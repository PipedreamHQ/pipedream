import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "notiff_io",
  propDefinitions: {
    idNotificationSource: {
      type: "string",
      label: "Notification Source ID",
      description: "The unique identifier for the notification source.",
      async options() {
        const sources = await this.listNotificationSources();
        return sources.map((source) => ({
          label: source.title,
          value: source.id,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the notification.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The content/description of the notification.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL associated with the notification.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://notiff.io/api/1.1/wf";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async listNotificationSources(opts = {}) {
      return this._makeRequest({
        path: "/list_notification_sources",
        ...opts,
      });
    },
    async sendNotification({
      idNotificationSource, title, description, url,
    }, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create_notification",
        data: {
          id_notification_source: idNotificationSource,
          title,
          description,
          url,
        },
        ...opts,
      });
    },
  },
};
