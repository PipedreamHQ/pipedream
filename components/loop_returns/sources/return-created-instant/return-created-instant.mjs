import { axios } from "@pipedream/platform";
import loopReturns from "../../loop_returns.app.mjs";

export default {
  key: "loop_returns-return-created-instant",
  name: "Return Created (Instant)",
  description: "Emits an event when a new return is created. [See the documentation](https://docs.loopreturns.com/reference/post_webhooks)",
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
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent returns to backfill events
      const returns = await this.loopReturns.listReturns({});
      for (const returnItem of returns.slice(-50).reverse()) {
        this.$emit(returnItem, {
          id: returnItem.id,
          summary: `Return #${returnItem.id} created`,
          ts: Date.parse(returnItem.created_at),
        });
      }
    },
    async activate() {
      // Create webhook for return.created event
      const { data } = await this.loopReturns._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          topic: "return",
          trigger: "return.created",
        },
      });

      // Store webhook ID for later deletion
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      // Retrieve stored webhook ID
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        // Delete the webhook subscription
        await this.loopReturns._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate webhook signature if applicable (code for validation not provided in API docs)

    // Emit the event for new return
    this.$emit(body, {
      id: body.id,
      summary: `New return created: #${body.id}`,
      ts: Date.parse(body.created_at),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};
