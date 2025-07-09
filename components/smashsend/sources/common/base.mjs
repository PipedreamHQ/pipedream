import smashsend from "../../smashsend.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    smashsend,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.smashsend.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(webhook?.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.smashsend.deleteWebhook({
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
    generateMeta(event) {
      const ts = Date.parse(event.timestamp);
      return {
        id: `${event.event}-${ts}`,
        summary: this.getSummary(event),
        ts,
      };
    },
    getEvents() {
      throw new ConfigurationError("getEvents must be implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary must be implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body || body.event === "TESTING_CONNECTION") {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
