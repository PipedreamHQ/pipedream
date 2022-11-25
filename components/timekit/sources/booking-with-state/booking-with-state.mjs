import timekit from "../../timekit.app.mjs";
import crypto from "crypto";

const docLink = "https://developers.timekit.io/reference/graphs";

export default {
  key: "timekit-booking-with-state",
  name: "New Booking with State",
  description: `Emit new event when a booking has a specific state. [See the docs](${docLink}).`,
  version: "0.0.1",
  type: "source",
  props: {
    timekit,
    db: "$.service.db",
    http: "$.interface.http",
    graph: {
      propDefinition: [
        timekit,
        "graph",
      ],
    },
    state: {
      propDefinition: [
        timekit,
        "state",
        (c) => ({
          graph: c.graph,
        }),
      ],
    },
    secret: {
      type: "string",
      label: "Secret",
      description: "Configured secret to verify webhook events. If left blank, no verification will be done. Navigate to API Settings > Keys and look for the last card on the page. The secret shown there is the key you'll use",
      secret: true,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      console.log("Creating webhook...");
      const response = await this.timekit.createWebhook({
        data: {
          url: this.http.endpoint,
          graph: this.graph,
          state: this.state,
          method: "post",
        },
      });
      const id = response.meta.message.split("id ")[1];
      this._setWebhookId(id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.timekit.deleteWebhook({
        id,
      });
      console.log(`Webhook ${id} was deleted successfully`);
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    verifySecret(payload, header) {
      if (this.secret) {
        const hash = crypto
          .createHmac("sha256", this.secret)
          .update(payload)
          .digest("hex");
        return hash === header;
      }
      return true;
    },
  },
  async run(event) {
    if (!this.verifySecret(event.bodyRaw, event.headers["x-timekit-signature"])) {
      console.log("Secret verification has failed for the incoming event. Skipping...");
      return;
    }

    const {
      id,
      description,
      updated_at: ts,
    } = event.body;

    this.$emit(event.body, {
      id,
      summary: `New ${this.graph} booking ${this.state}: ${description}`,
      ts,
    });
  },
};
