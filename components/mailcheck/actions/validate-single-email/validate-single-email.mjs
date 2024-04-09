import mailcheck from "../../mailcheck.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailcheck-validate-single-email",
  name: "Validate Single Email",
  description: "Fetches deliverability data (trust rate) about a single email and enriches it with owner information, if possible.",
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
    const deliverabilityData = await this.mailcheck.fetchDeliverabilityData({
      email: this.email,
    });
    const verificationData = await this.mailcheck.verifyEmail({
      email: this.email,
    });

    const result = {
      deliverabilityData: deliverabilityData,
      verificationData: verificationData,
    };

    $.export("$summary", `Fetched deliverability and verification data for ${this.email}`);
    return result;
  },
};
