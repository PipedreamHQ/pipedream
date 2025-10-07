import mailboxvalidator from "../../app/mailboxvalidator.app";
import { defineAction } from "@pipedream/types";
import {
  ValidateEmailParams, ValidateEmailResponse,
} from "../../common/types";

export default defineAction({
  name: "Validate Email",
  description:
    "Validate an email address [See docs here](https://www.mailboxvalidator.com/api-single-validation)",
  key: "mailboxvalidator-validate-email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailboxvalidator,
    email: {
      label: "Email Address",
      description: "The email address to be validated.",
      type: "string",
    },
  },
  async run({ $ }): Promise<ValidateEmailResponse> {
    const params: ValidateEmailParams = {
      $,
      params: {
        email: this.email,
      },
    };
    const data: ValidateEmailResponse = await this.mailboxvalidator.validateEmail(params);

    if (data.error_code) {
      throw new Error(`MailboxValidator response: error code ${data.error_code} - ${data.error_message}`);
    }

    $.export("$summary", `Verified email ${data.email_address} (${data.status.toLowerCase() === "true"
      ? "valid"
      : "invalid"})`);

    return data;
  },
});
