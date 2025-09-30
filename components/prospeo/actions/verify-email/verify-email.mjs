import { ConfigurationError } from "@pipedream/platform";
import prospeo from "../../prospeo.app.mjs";

export default {
  name: "Verify Email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prospeo-verify-email",
  description: "Verify the validity of an email address. [See the documentation](https://prospeo.io/api/email-verifier)",
  type: "action",
  props: {
    prospeo,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to verify",
      optional: true,
    },
    emailAnonId: {
      type: "string",
      label: "Email Anon ID",
      description: "The ID of the email obtained from the `Search Domain` action.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.emailAnonId) {
      throw new ConfigurationError("Either email or emailAnonId is required");
    }
    try {
      const response = await this.prospeo.verifyEmail({
        $,
        data: {
          email: this.email,
          email_anon_id: this.emailAnonId,
        },
      });

      $.export("$summary", `Successfully verified: ${this.email || this.emailAnonId}`);

      return response;
    } catch ({ response }) {
      if (response.data.message === "NO_RESULT") {
        $.export("$summary", `No results found for **${this.email || this.emailAnonId}**`);
        return {};
      } else {
        throw new ConfigurationError(response.data.message);
      }
    }
  },
};
