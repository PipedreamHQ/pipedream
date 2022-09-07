import quickemailverification from "../../app/quickemailverification.app";
import { defineAction } from "@pipedream/types";
import { VerifyEmailParams } from "../../common/requestParams";

export default defineAction({
  name: "Verify Email Address",
  description:
    "Verify an email address [See docs here](http://docs.quickemailverification.com/email-verification-api/verify-an-email-address)",
  key: "quickemailverification-verify-email-address",
  version: "0.0.1",
  type: "action",
  props: {
    quickemailverification,
    email: {
      label: "Email Address",
      description: "An email address to be verified.",
      type: "string",
    },
  },
  async run({ $ }): Promise<any> {
    const params: VerifyEmailParams = {
      $,
      params: {
        email: this.email
      }
    };
    const data = await this.quickemailverification.verifyEmailAddress(params);

    $.export("$summary", "Verified email address successfully");

    return data;
  },
});
