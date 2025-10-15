import acymailing from "../../acymailing.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "acymailing-email-user",
  name: "Email User",
  description: "Sends an email to a single AcyMailing user. The user must exist in the AcyMailing database. [See the documentation](https://docs.acymailing.com/v/rest-api/emails#send-an-email-to-a-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    acymailing,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the receiver.",
    },
    autoAddUser: {
      type: "boolean",
      label: "Auto Add User",
      description: "Defaults to false. If the email address doesn't match an existing AcyMailing user, one will be automatically created if this option is set to true.",
      optional: true,
    },
    emailId: {
      type: "integer",
      label: "Email Id",
      description: "The mail ID to send. This is not a campaign ID but the mail ID of the table xxx_acym_mail in the database, or the mail_id of a campaign.",
    },
    trackEmail: {
      type: "boolean",
      label: "Track Email",
      description: "Defaults to true. If true, the open/click statistics will be collected for this email.",
      optional: true,
    },
    params: {
      type: "object",
      label: "Params",
      description: "An object of shortcodes and values to replace in the body of the sent email. Example: { \"shortcode1\": \"value 1\" }. If the body of the sent email contains the text \"{shortcode1}\", it will be replaced by \"value 1\" in the sent version.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acymailing.sendEmailToUser({
      $,
      data: {
        email: this.email,
        autoAddUser: this.autoAddUser,
        emailId: this.emailId,
        trackEmail: this.trackEmail,
        params: parseObject(this.params),
      },
    });
    $.export("$summary", `Email successfully sent to ${this.email}`);
    return response;
  },
};
