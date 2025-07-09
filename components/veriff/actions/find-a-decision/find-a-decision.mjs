import crypto from "crypto";
import app from "../../veriff.app.mjs";

export default {
  key: "veriff-find-a-decision",
  name: "Find A Decision",
  description: "Finds decision by session ID. [See the documentation](https://devdocs.veriff.com/apidocs/v1sessionsiddecision-1)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The session ID to find the decision for",
    },
  },
  async run({ $ }) {
    const hmacSignature = crypto
      .createHmac("sha256", this.app.$auth.secret_key)
      .update(this.sessionId)
      .digest("hex");

    const response = await this.app.getSessionDecision({
      $,
      sessionId: this.sessionId,
      headers: {
        "x-hmac-signature": hmacSignature,
      },
    });

    $.export("$summary", `Found decision for session ${this.sessionId}`);
    return response;
  },
};
