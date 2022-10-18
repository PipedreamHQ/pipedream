import mailboxvalidator from "../../app/mailboxvalidator.app";
import { defineAction } from "@pipedream/types";
import {
  VerifyEmailParams, VerifyEmailResponse,
} from "../../common/types";

export default defineAction({
  name: "Validate Email",
  description:
    "Validate an email address [See docs here](https://www.mailboxvalidator.com/api-single-validation)",
  key: "mailboxvalidator-validate-email",
  version: "0.0.1",
  type: "action",
  props: {
    mailboxvalidator,
    email: {
      label: "Email Address",
      description: "The email address to be validated.",
      type: "string",
    },
  },
  async run({ $ }): Promise<VerifyEmailResponse> {
    const params: VerifyEmailParams = {
      $,
      params: {
        email: this.email,
      },
    };
    const data: VerifyEmailResponse = await this.mailboxvalidator.verifyEmailAddress(params);

    $.export("$summary", `Verified email ${data.email} (${data.result})`);

    return data;
  },
});
