import acymailing from "../../acymailing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acymailing-email-user",
  name: "Email User",
  description: "Sends an email to a single AcyMailing user. The user must exist in the AcyMailing database.",
  version: "0.0.1",
  type: "action",
  props: {
    acymailing,
    userEmail: {
      propDefinition: [
        acymailing,
        "userEmail",
      ],
    },
    emailContent: {
      propDefinition: [
        acymailing,
        "emailContent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.acymailing.sendEmailToUser(this.userEmail, this.emailContent);
    $.export("$summary", `Email successfully sent to ${this.userEmail}`);
    return response;
  },
};
