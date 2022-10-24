import neverbounce from "../../app/neverbounce.app.mjs";
import { defineAction } from "@pipedream/types";
export default defineAction({
  name: "Verify Email Address",
  description: "Verify an email address [See docs here](https://developers.neverbounce.com/docs/verifying-an-email)",
  key: "neverbounce-verify-email-address",
  version: "0.0.1",
  type: "action",
  props: {
    neverbounce,
    email: {
      label: "Email Address",
      description: "An email address to be verified.",
      type: "string",
    },
  },
  async run({ $ }) {
    const email = this.email;
    const params = {
      $,
      params: {
        email,
      },
    };
    const data = await this.neverbounce.verifyEmailAddress(params);
    $.export("$summary", `Verified email ${email} (${data.result})`);
    return data;
  },
});
