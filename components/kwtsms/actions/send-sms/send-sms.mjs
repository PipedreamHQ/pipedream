import kwtsms from "../../kwtsms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kwtsms-send-sms",
  name: "Send SMS",
  description: "Sends an SMS to a specified number. [See the documentation](https://api.kwtsms.com/doc/kwtsms.com_api_documentation_v36.pdf)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kwtsms,
    recipientNumber: {
      propDefinition: [
        kwtsms,
        "recipientNumber",
      ],
    },
    messageContent: {
      propDefinition: [
        kwtsms,
        "messageContent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kwtsms.sendSms({
      recipientNumber: this.recipientNumber,
      messageContent: this.messageContent,
    });

    $.export("$summary", `Sent SMS to ${this.recipientNumber}`);
    return response;
  },
};
