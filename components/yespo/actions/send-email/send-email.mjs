import yespo from "../../yespo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "yespo-send-email",
  name: "Send Email",
  description: "Generates and sends an email using the assigned template. [See the documentation](https://docs.yespo.io/reference/sendemail-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    yespo,
    recipientEmail: yespo.propDefinitions.recipientEmail,
    messageSubject: yespo.propDefinitions.messageSubject,
    messageBody: yespo.propDefinitions.messageBody,
  },
  async run({ $ }) {
    const response = await this.yespo.sendEmail({
      recipientEmail: this.recipientEmail,
      messageSubject: this.messageSubject,
      messageBody: this.messageBody,
    });

    $.export("$summary", `Email sent successfully to ${this.recipientEmail}`);
    return response;
  },
};
