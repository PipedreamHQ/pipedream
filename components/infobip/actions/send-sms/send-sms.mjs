import infobip from "../../infobip.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "infobip-send-sms",
  name: "Send SMS",
  description: "Sends an SMS message to a specified number. [See the documentation](https://www.infobip.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    infobip,
    phoneNumber: infobip.propDefinitions.phoneNumber,
    message: infobip.propDefinitions.message,
    sender: {
      ...infobip.propDefinitions.sender,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.infobip.sendSms({
      phoneNumber: this.phoneNumber,
      message: this.message,
      sender: this.sender,
    });

    $.export("$summary", `Successfully sent SMS to ${this.phoneNumber}`);
    return response;
  },
};
