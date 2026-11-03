import { ConfigurationError } from "@pipedream/platform";
import app from "../../proweblook.app.mjs";

export default {
  key: "proweblook-verify-email",
  name: "Verify Email",
  description: "Verify whether an email address is deliverable, undeliverable, or unknown using ProWebLook."
    + " Returns `data.verdict` (`deliverable`, `undeliverable`, or `unknown`), `data.reason`, and `data.billing_status`."
    + " Use **Get Balance** beforehand if you want to check remaining email verification credits."
    + " [See the documentation](https://proweblook.com/openapi.json)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const email = this.email?.trim();
    if (!email) {
      throw new ConfigurationError("Email Address is required, e.g. `person@example.com`.");
    }

    const response = await this.app.verifyEmail({
      $,
      data: {
        email,
      },
    });

    $.export("$summary", `Verified email ${email}: ${response?.data?.verdict || "completed"}`);
    return response;
  },
};
