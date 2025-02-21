import elasticEmail from "../../elastic_email.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "elastic_email-send-email",
  name: "Send Email",
  description: "Sends an email to one or more recipients. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    elastic_email,
    sendEmailRecipients: {
      propDefinition: [
        "elastic_email",
        "sendEmailRecipients",
      ],
    },
    sendEmailSubject: {
      propDefinition: [
        "elastic_email",
        "sendEmailSubject",
      ],
    },
    sendEmailBody: {
      propDefinition: [
        "elastic_email",
        "sendEmailBody",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.elastic_email.sendBulkEmails();
    $.export("$summary", `Emails sent successfully to ${this.sendEmailRecipients.join(", ")}`);
    return response;
  },
};
