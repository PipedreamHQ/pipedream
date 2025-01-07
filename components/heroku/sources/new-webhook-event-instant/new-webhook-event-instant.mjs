import heroku from "../../heroku.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "heroku-new-webhook-event-instant",
  name: "New Webhook Event (Instant)",
  description: "Emit new event on each webhook event. [See the documentation](https://devcenter.heroku.com/articles/app-webhooks-schema#webhook-create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    heroku,
    http: "$.interface.http",
    db: "$.service.db",
    appId: {
      propDefinition: [
        heroku,
        "appId",
      ],
    },
    entities: {
      propDefinition: [
        heroku,
        "entities",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.heroku.createWebhookSubscription({
        appId: this.appId,
        data: {
          include: this.entities,
          level: "notify",
          url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.heroku.deleteWebhookSubscription({
          appId: this.appId,
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
      return {
        id: event.id,
        summary: `New ${event.webhook_metadata.event.include} - ${event.action} Event`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
  sampleEmit,
};
