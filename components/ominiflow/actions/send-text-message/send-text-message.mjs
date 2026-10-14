import ominiflow from "../../ominiflow.app.mjs";

export default {
  key: "ominiflow-send-text-message",
  name: "Send WhatsApp Text Message",
  description: "Send a direct WhatsApp text message to any phone number via Ominiflow",
  version: "0.0.1",
  type: "action",
  props: {
    ominiflow,
    phone: {
      type: "string",
      label: "Recipient Phone Number",
      description: "The phone number with country code (e.g. `+919876543210` or `919876543210`).",
    },
    message: {
      type: "string",
      label: "Message Text",
      description: "The text content of the message you want to send.",
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
