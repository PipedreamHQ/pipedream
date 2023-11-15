import { axios } from "@pipedream/platform";
import loopReturns from "../../loop_returns.app.mjs";

export default {
  key: "loop_returns-return-status-updated-instant",
  name: "Return Status Updated (Instant)",
  description: "Emit new event when the status of a return has been updated. [See the documentation](https://docs.loopreturns.com/reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loopReturns,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    returnId: {
      propDefinition: [
        loopReturns,
        "returnId",
      ],
    },
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
      // Emit events for the 50 most recent updates
      const { returns } = await this.loopReturns.listReturns({
        prevContext: {},
      });
      returns.slice(-50).forEach((ret) => {
        this.$emit(ret, {
          id: ret.id,
          summary: `Return #${ret.id} status updated`,
          ts: Date.parse(ret.updated_at),
        });
      });
    },
    async activate() {
      // Create webhook subscription
      const webhook = await this.loopReturns.createWebhook({
        topic: "return",
        trigger: "return.updated",
        url: this.http.endpoint,
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      // Delete webhook subscription
      const webhookId = this._getWebhookId();
      await this.loopReturns.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      this.http.respond({
        status: 404,
        body: "No event data received",
      });
      return;
    }

    // Validate the event is for the returnId configured
    if (body.id.toString() !== this.returnId) {
      this.http.respond({
        status: 200, // Acknowledge receipt but do not process
        body: "Return ID does not match the configured value",
      });
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `Return #${body.id} status updated`,
      ts: Date.parse(body.updated_at),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
