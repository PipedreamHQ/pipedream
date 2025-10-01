import landbot from "../../landbot.app.mjs";

export default {
  key: "landbot-send-text-message",
  name: "Send Text Message",
  description: "Send a text message to a customer. [See the documentation](https://api.landbot.io/#api-Customers-PostHttpsApiLandbotIoV1CustomersCustomer_idSend_text)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    landbot,
    customerId: {
      propDefinition: [
        landbot,
        "customerId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the customer",
    },
  },
  async run({ $ }) {
    const response = await this.landbot.sendTextMessage({
      $,
      customerId: this.customerId,
      data: {
        message: this.message,
      },
    });
    $.export("$summary", `Successfully sent message to Customer ID: ${this.customerId}`);
    return response;
  },
};
