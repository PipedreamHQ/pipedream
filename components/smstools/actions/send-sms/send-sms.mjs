import smstools from "../../smstools.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smstools-send-sms",
  name: "Send SMS or WhatsApp Message",
  description: "Sends a SMS or WhatsApp message to a specified contact. [See the documentation](https://www.smstools.com/en/sms-gateway-api/send_message)",
  version: "0.0.1",
  type: "action",
  props: {
    smstools,
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent.",
    },
    to: {
      propDefinition: [
        smstools,
        "to",
      ],
    },
    sender: {
      propDefinition: [
        smstools,
        "sender",
      ],
    },
    date: {
      propDefinition: [
        smstools,
        "date",
      ],
      optional: true,
    },
    reference: {
      propDefinition: [
        smstools,
        "reference",
      ],
      optional: true,
    },
    test: {
      propDefinition: [
        smstools,
        "test",
      ],
      optional: true,
    },
    subId: {
      propDefinition: [
        smstools,
        "subId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smstools.sendMessage({
      message: this.message,
      to: this.to,
      sender: this.sender,
      date: this.date,
      reference: this.reference,
      test: this.test,
      subId: this.subId,
    });
    $.export("$summary", `Message sent successfully with ID: ${response.messageid}`);
    return response;
  },
};
