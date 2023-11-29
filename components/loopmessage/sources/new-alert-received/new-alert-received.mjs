import app from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-new-alert-received",
  name: "New Alert Received (Instant)",
  description: "Emit new event when an alert is received via webhook. [See the documentation](https://docs.loopmessage.com/imessage-conversation-api/messaging/webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    alertType: {
      propDefinition: [
        app,
        "alertType",
      ],
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.webhook_id,
      summary: `New Alert From ${body.sender_name}`,
      ts: Date.parse(body.created_at),
    });

    this.http.respond({
      status: 200,
    });
  },
};
