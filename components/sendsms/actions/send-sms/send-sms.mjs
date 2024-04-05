import sendsms from "../../sendsms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendsms-send-sms",
  name: "Send SMS",
  description: "Send a singular SMS to your customers. [See the documentation](https://www.sendsms.ro/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendsms,
    destinationNumber: sendsms.propDefinitions.destinationNumber,
    messageContent: sendsms.propDefinitions.messageContent,
  },
  async run({ $ }) {
    const response = await this.sendsms.sendSms({
      destinationNumber: this.destinationNumber,
      messageContent: this.messageContent,
    });

    $.export("$summary", `SMS sent successfully to ${this.destinationNumber}`);
    return response;
  },
};
