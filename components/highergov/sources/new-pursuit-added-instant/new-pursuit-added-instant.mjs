import highergov from "../../highergov.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "highergov-new-pursuit-added-instant",
  name: "New Pursuit Added Instant",
  description: "Emit new event when a pursuit is added to the pipeline. [See the documentation](https://docs.highergov.com/import-and-export/zapier-integration)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    highergov: {
      type: "app",
      app: "highergov",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const events = await this.highergov.performList({
        max: 50,
      });
      for (const event of events) {
        this.$emit(event, {
          id: event.opp_key,
          summary: `New pursuit added: ${event.title}`,
          ts: Date.parse(event.current_datetime),
        });
      }
    },
    async activate() {
      const hookId = await this.highergov.subscribeWebhook({
        targetUrl: this.http.endpoint,
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.highergov.unsubscribeWebhook({
        id,
      });
    },
  },
  async run(event) {
    const signature = event.headers["x-highergov-signature"];
    const computedSignature = crypto.createHmac("sha256", this.highergov.$auth.api_key)
      .update(event.rawBody)
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    const pursuit = event.body;
    this.$emit(pursuit, {
      id: pursuit.opp_key,
      summary: `New pursuit added: ${pursuit.title}`,
      ts: Date.parse(pursuit.current_datetime),
    });
  },
};
