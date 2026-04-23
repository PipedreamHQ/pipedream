import ottertext from "../../ottertext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ottertext-send-message-instant",
  name: "Send Message Instantly",
  description: "Immediately send a message to a customer who has opted to receive messages. This uses the OtterText API to send a message instantly to a specified customer.",
  version: "0.0.1",
  type: "action",
  props: {
    ottertext,
    customerId: ottertext.propDefinitions.customerId,
    messageContent: {
      ...ottertext.propDefinitions.messageContent,
      description: "The content of the message. If not provided, a default message will be sent.",
      optional: true,
      default: "Thank you for choosing us!",
    },
  },
  async run({ $ }) {
    const response = await this.ottertext.sendMessage({
      customerId: this.customerId,
      messageContent: this.messageContent,
    });
    $.export("$summary", `Message sent successfully to customer ID: ${this.customerId}`);
    return response;
  },
};
