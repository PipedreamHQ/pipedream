import infobip from "../../infobip.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "infobip-new-sms-message-instant",
  name: "New SMS Message Instant",
  description: "Emits a new event when a new SMS message is received.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    infobip,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      // This is a placeholder for the webhook setup code. Adjust with actual Infobip setup if necessary.
      // Example: const webhookId = await this.infobip.setupWebhook("https://your.pipedream.source.url");
      // this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // This is a placeholder for the webhook teardown code. Adjust with actual Infobip setup if necessary.
      // Example: const webhookId = this.db.get("webhookId");
      // await this.infobip.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "Received",
    });

    const smsMessage = event.body;
    if (!smsMessage) {
      this.http.respond({
        status: 400,
        body: "No SMS message found in the request body",
      });
      return;
    }

    this.$emit(smsMessage, {
      id: smsMessage.messageId || smsMessage.id,
      summary: `New SMS from ${smsMessage.from}: ${smsMessage.text}`,
      ts: smsMessage.receivedAt
        ? new Date(smsMessage.receivedAt).getTime()
        : Date.now(),
    });
  },
};
