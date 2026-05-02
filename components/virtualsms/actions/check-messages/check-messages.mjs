import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-check-messages",
  name: "Check Messages",
  description: "Poll an active rental for any SMS messages received so far. Returns the current order state, including a `messages` array (each item has `sender`, `content`, `received_at`) when one or more SMS have arrived. For event-driven workflows prefer the **New SMS Received** trigger. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    virtualsms,
    orderId: {
      propDefinition: [
        virtualsms,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.virtualsms.getOrder({
      $,
      orderId: this.orderId,
    });

    const status = response?.status ?? "unknown";
    const hasMessage = Array.isArray(response?.messages) && response.messages.length > 0;
    // Do NOT include the OTP / SMS body in $summary — summary is shown in run history,
    // logs, and notifications. Keep the message contents in the response payload only.
    const summary = hasMessage
      ? `SMS received (status ${status})`
      : `No SMS yet — status ${status}`;
    $.export("$summary", summary);
    return response;
  },
};
