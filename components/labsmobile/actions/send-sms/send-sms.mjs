import labsmobile from "../../labsmobile.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "labsmobile-send-sms",
  name: "Send SMS",
  description: "Sends a new SMS message. [See the documentation](https://apidocs.labsmobile.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    labsmobile,
    to: labsmobile.propDefinitions.to,
    message: labsmobile.propDefinitions.message,
  },
  async run({ $ }) {
    const response = await this.labsmobile.sendSMS({
      to: this.to,
      message: this.message,
    });
    $.export("$summary", `Successfully sent SMS to ${this.to}`);
    return response;
  },
};
