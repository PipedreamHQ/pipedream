import daktela from "../../daktela.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "daktela-send-sms",
  name: "Send SMS",
  description: "Sends an SMS from the Daktela platform. [See the documentation](https://customer.daktela.com/apihelp/v6/working-with/sms-chat-activities)",
  version: "0.0.1",
  type: "action",
  props: {
    daktela,
    receiverNumber: {
      propDefinition: [
        daktela,
        "receiverNumber",
      ],
    },
    textContent: {
      propDefinition: [
        daktela,
        "textContent",
      ],
    },
    senderName: {
      propDefinition: [
        daktela,
        "senderName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      to: this.receiverNumber,
      text: this.textContent,
      from: this.senderName,
    };

    const response = await this.daktela.sendSms(params);

    $.export("$summary", `Successfully sent SMS to ${this.receiverNumber}`);
    return response;
  },
};
