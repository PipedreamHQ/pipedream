import mailcheck from "../../mailcheck.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailcheck-verify-email",
  name: "Verify Email",
  description: "Verifies the validity of a provided email address. [See the documentation](https://api.mailcheck.co/v1/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    mailcheck,
    email: {
      propDefinition: [
        mailcheck,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mailcheck.verifyEmail({
      email: this.email,
    });
    $.export("$summary", `Email verification status: ${response.status}`);
    return response;
  },
};
