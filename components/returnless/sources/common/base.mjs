import returnless from "../../returnless.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    returnless,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the webhook",
    },
  },
  hooks: {
    async activate() {
      const { data: { id } } = await this.returnless.createWebhook({
        data: {
          endpoint: this.http.endpoint,
          description: this.description,
          is_enabled: true,
          events: this.getEvents(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.returnless.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: this.getSummary(data),
        ts: Date.now(),
      };
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body?.data) {
      return;
    }

    const meta = this.generateMeta(body.data);
    this.$emit(body.data, meta);
  },
};
