import clicksend from "../../clicksend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clicksend-send-sms",
  name: "Send SMS",
  description: "Sends a new SMS to one or several recipients. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#send-sms-message-s)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clicksend,
    recipientNumber: {
      propDefinition: [
        clicksend,
        "recipientNumber",
      ],
    },
    message: {
      propDefinition: [
        clicksend,
        "message",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clicksend.sendSms({
      recipientNumber: this.recipientNumber,
      message: this.message || "This is a test message from Pipedream ClickSend action.",
    });

    $.export("$summary", `Sent SMS to ${this.recipientNumber}`);
    return response;
  },
};
