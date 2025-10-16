import neverbounce from "../../app/neverbounce.app";
import { defineAction } from "@pipedream/types";
import {
  VerifyEmailParams, VerifyEmailResponse,
} from "../../common/types";

export default defineAction({
  name: "Verify Email Address",
  description:
    "Verify an email address [See docs here](https://developers.neverbounce.com/docs/verifying-an-email)",
  key: "neverbounce-verify-email-address",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    neverbounce,
    email: {
      label: "Email Address",
      description: "An email address to be verified.",
      type: "string",
    },
  },
  async run({ $ }): Promise<VerifyEmailResponse> {
    const email = this.email;
    const params: VerifyEmailParams = {
      $,
      params: {
        email,
      },
    };
    const data: VerifyEmailResponse = await this.neverbounce.verifyEmailAddress(params);

    $.export("$summary", `Verified email ${email} (${data.result})`);

    return data;
  },
});
