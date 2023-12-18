import { axios } from "@pipedream/platform";
import fidelApi from "../../fidel_api.app.mjs";

export default {
  key: "fidel_api-transaction-completed-instant",
  name: "Transaction Completed (Instant)",
  description: "Emits an event when a transaction is completed using a card linked to the Fidel API. [See the documentation](https://reference.fidel.uk/reference/create-webhook-program)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fidelApi,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    programId: {
      propDefinition: [
        fidelApi,
        "programId",
      ],
    },
    url: {
      propDefinition: [
        fidelApi,
        "url",
      ],
    },
    eventName: {
      propDefinition: [
        fidelApi,
        "eventName",
        (c) => ({
          eventName: "transaction.auth",
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical events on deploy
      const programs = await this.fidelApi.listPrograms({
        limit: 50,
        start: undefined,
        order: "desc",
      });
      if (!programs || programs.length === 0) {
        throw new Error("No programs found during deploy.");
      }
      // Assuming that the historical transactions are not available, so we skip emitting them
    },
    async activate() {
      // Create a webhook subscription
      const { data: webhook } = await this.fidelApi.createWebhook({
        programId: this.programId,
        eventName: this.eventName,
        url: this.url,
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.fidelApi.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  async run(event) {
    const { body: transaction } = event;

    // Validate the incoming webhook signature (if applicable)
    // Signature validation logic would go here

    // Emit the new transaction
    this.$emit(transaction, {
      id: transaction.id,
      summary: `Transaction completed: ${transaction.amount} ${transaction.currency}`,
      ts: Date.parse(transaction.created),
    });
  },
};
