import loopmessage from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-new-alert-received",
  name: "New Alert Received",
  description: "Emit an event when an alert is received via webhook. [See the documentation](https://docs.loopmessage.com/imessage-conversation-api/messaging/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loopmessage: {
      type: "app",
      app: "loopmessage",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    alertType: {
      propDefinition: [
        loopmessage,
        "alertType",
      ],
    },
    senderName: {
      propDefinition: [
        loopmessage,
        "senderName",
      ],
    },
  },
  async run(event) {
    const body = event.body;
    const {
      alert_type, sender_name,
    } = body;

    // Validate the alert type and sender name
    if (!alert_type || !sender_name) {
      this.http.respond({
        status: 400,
        body: "Missing required fields: alert_type and/or sender_name",
      });
      return;
    }

    // Check if the received alert type matches the configured alert type
    if (alert_type !== this.alertType) {
      this.http.respond({
        status: 200,
        body: "Alert type does not match specified criteria.",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: `${body.message_id || body.webhook_id}`,
      summary: `New alert received: ${alert_type} from ${sender_name}`,
      ts: Date.now(),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
