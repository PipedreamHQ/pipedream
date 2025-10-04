import app from "../../twilio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "twilio-check-verification-token",
  name: "Check Verification Token",
  description: "Check if user-provided token is correct. [See the documentation](https://www.twilio.com/docs/verify/api)",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    serviceSid: {
      propDefinition: [
        app,
        "serviceSid",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    code: {
      type: "string",
      label: "Code",
      description: "The code to check",
    },
  },
  async run({ $ }) {
    try {
      const res = await this.app.checkVerificationToken(
        this.serviceSid,
        this.to,
        this.code,
      );
      $.export("$summary", `Verification code is ${res.valid
        ? ""
        : "not"} valid`);
      return res;
    } catch (e) {
      if (e.status === 404) {
        throw new ConfigurationError("Verification ID not found. Twilio deletes the verification SID once it's expired (10 minutes), approved, or the max attempts to check a code have been reached.");
      }
      throw new ConfigurationError(JSON.stringify(e));
    }
  },
};
