import findymail from "../../findymail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "findymail-verify-email",
  name: "Verify Email",
  description: "Verifies the deliverability of a specified email. [See the documentation](https://app.findymail.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    findymail,
    email: {
      propDefinition: [
        findymail,
        "email",
      ]
    },
  },
  async run({ $ }) {
    const response = await this.findymail.verifyEmail({
      email: this.email,
    });
    $.export("$summary", `Email verification status: ${response.verified ? 'Verified' : 'Not Verified'}`);
    return response;
  },
};