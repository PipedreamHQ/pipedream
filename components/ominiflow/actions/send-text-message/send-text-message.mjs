import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-send-text-message",
  name: "Send WhatsApp Text Message",
  description: "Send a direct WhatsApp text message to any phone number via Ominiflow. [See the documentation](https://ominiflow.com/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ominiflow,
    phone: {
      propDefinition: [ominiflow, "phone"],
    },
    message: {
      type: "string",
      label: "Message Text",
      description: "The text content of the message you want to send, e.g. `Hello! Your order #12345 has been confirmed and is on its way.`.",
    },
  },
  async run({ $ }) {
    const response = await this.ominiflow.sendTextMessage({
      $,
      phone: this.phone,
      message: this.message,
    });

    if (response?.status === "error") {
      throw new Error(`Ominiflow error: ${response.message || response.errors || "Failed to send message"}`);
    }

    $.export("$summary", `WhatsApp message sent successfully to ${this.phone}`);
    return response;
  },
};
