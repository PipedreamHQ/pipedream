import loopReturns from "../../loop_returns.app.mjs";

export default {
  key: "loop_returns-label-updated-instant",
  name: "Label Updated (Instant)",
  description: "Emit new event when a label is updated. [See the documentation](https://docs.loopreturns.com/reference/post_webhooks)",
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
    labelId: {
      propDefinition: [
        loopReturns,
        "labelId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Since the API does not provide an endpoint for fetching labels,
      // we will assume this is not possible. If an endpoint becomes available,
      // this method should be updated to fetch and emit labels.
    },
    async activate() {
      // Create a webhook subscription
      const webhook = await this.loopReturns._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          topic: "label",
          trigger: "label.updated",
          url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      await this.loopReturns._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    const { body } = event;

    // Check if the labelId matches the updated label
    if (body.label && body.label.id.toString() === this.labelId) {
      this.$emit(body, {
        id: body.label.id,
        summary: `Label #${body.label.id} updated`,
        ts: Date.parse(body.label.updated_at),
      });
    } else {
      console.log("Received a label update event, but the label ID does not match the configured label ID.");
    }
  },
};
