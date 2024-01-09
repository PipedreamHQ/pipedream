import easyly from "../../easyly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "easyly-new-automation-triggered-instant",
  name: "New Automation Triggered (Instant)",
  description: "Emits a new event when an automation with the action 'zapier' is triggered in network leads. [See the documentation](https://api.easyly.com/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    easyly,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    automationName: {
      propDefinition: [
        easyly,
        "automationName",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the 50 most recent automation events
      const automations = await this.easyly.triggerAutomation({
        automationName: this.automationName,
      });
      automations.slice(-50).forEach((automation) => {
        this.$emit(automation, {
          id: automation.id || `${automation.created}-${automation.data.field.key}`,
          summary: `Automation '${automation.name}' triggered`,
          ts: automation.created * 1000,
        });
      });
    },
    async activate() {
      // Create a webhook subscription
      const webhook = await this.easyly.createWebhookSubscription({
        automationName: this.automationName,
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      await this.easyly.deleteWebhookSubscription({
        id: webhookId,
      });
    },
  },
  async run(event) {
    const { body } = event;
    const automationAction = body?.data?.action;

    if (automationAction === "zapier" && body?.data?.name === this.automationName) {
      this.$emit(body, {
        id: body.id || `${body.created}-${body.data.field.key}`,
        summary: `Automation '${this.automationName}' triggered`,
        ts: body.created * 1000, // Convert to milliseconds
      });

      this.http.respond({
        status: 200,
        body: "Event processed",
      });
    } else {
      this.http.respond({
        status: 400,
        body: "Event does not match the specified automation",
      });
    }
  },
};
