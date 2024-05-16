import pidj from "../../pidj.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pidj-send-message",
  name: "Send Message",
  description: "Sends a text message to a specified phone number from your pidj account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pidj,
    recipientPhoneNumber: pidj.propDefinitions.recipientPhoneNumber,
    messageText: pidj.propDefinitions.messageText,
    scheduledSendTime: {
      ...pidj.propDefinitions.scheduledSendTime,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pidj.sendMessage({
      recipientPhoneNumber: this.recipientPhoneNumber,
      messageText: this.messageText,
      scheduledSendTime: this.scheduledSendTime,
    });
    $.export("$summary", `Message successfully sent to ${this.recipientPhoneNumber}`);
    return response;
  },
};
