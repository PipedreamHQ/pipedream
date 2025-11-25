import shortcut from "../../shortcut.app.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    shortcut,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.createWebhook({
        data: {
          webhook_url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.deleteWebhook({
        hookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _baseUrl() {
      return "https://api.app.shortcut.com/api/v3/integrations";
    },
    headers() {
      return {
        "Shortcut-Token": `${this.shortcut.$auth.api_key}`,
      };
    },
    createWebhook(opts = {}) {
      return axios(this, {
        url: `${this._baseUrl()}/webhook`,
        method: "POST",
        headers: this.headers(),
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return axios(this, {
        url: `${this._baseUrl()}/webhook/${hookId}`,
        method: "DELETE",
        headers: this.headers(),
        ...opts,
      });
    },
    processEvent() {
      throw new ConfigurationError("processEvent is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    this.http.respond({
      status: 200,
    });

    await this.processEvent(body);
  },
};
