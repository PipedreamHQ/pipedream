import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-check-messages",
  name: "Check Messages",
  description: "Poll an active rental for any SMS messages received so far. Returns the current order state including `sms_code` and `sms_text` if a message has arrived. For event-driven workflows prefer the **New SMS Received** trigger. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
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
    const code = response?.sms_code;
    const summary = code
      ? `SMS received: ${code} (status ${status})`
      : `No SMS yet — status ${status}`;
    $.export("$summary", summary);
    return response;
  },
};
