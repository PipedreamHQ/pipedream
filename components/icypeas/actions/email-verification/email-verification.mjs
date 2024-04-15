import icypeas from "../../icypeas.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icypeas-email-verification",
  name: "Email Verification",
  description: "Performs an email verification check. [See the documentation](https://api-doc.icypeas.com/find-emails/single-search/email-verification)",
  version: "0.0.1",
  type: "action",
  props: {
    icypeas,
    email: icypeas.propDefinitions.email,
  },
  async run({ $ }) {
    const response = await this.icypeas.verifyEmail({
      email: this.email,
    });
    $.export("$summary", `Email verification status for ${this.email} retrieved successfully`);
    return response;
  },
};
