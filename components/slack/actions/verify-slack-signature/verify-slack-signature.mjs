import crypto from "crypto";
import slack from "../../slack.app.mjs";

export default {
  key: "slack-verify-slack-signature",
  name: "Verify Slack Signature",
  description: "Verifying requests from Slack, slack signs its requests using a secret that's unique to your app. [See the documentation](https://api.slack.com/authentication/verifying-requests-from-slack)",
  version: "0.0.11",
  type: "action",
  props: {
    slack,
    slackSigningSecret: {
      type: "string",
      label: "Signing Secret",
      description: "Slack [Signing Secret](https://api.slack.com/authentication/verifying-requests-from-slack#:~:text=Slack%20Signing%20Secret%2C%20available%20in%20the%20app%20admin%20panel%20under%20Basic%20Info.), available in the app admin panel under Basic Info.",
      secret: true,
    },
    slackSignature: {
      type: "string",
      label: "X-Slack-Signature",
      description: "Slack signature (from X-Slack-Signature header).",
    },
    slackRequestTimestamp: {
      type: "string",
      label: "X-Slack-Request-Timestamp",
      description: "Slack request timestamp (from X-Slack-Request-Timestamp header).",
    },
    requestBody: {
      type: "any",
      label: "Request Body",
      description: "The body of the request to be verified.",
    },
  },
  async run({ $ }) {
    const {
      slackSignature,
      slackRequestTimestamp,
      requestBody,
      slackSigningSecret,
    } = this;
    const requestBodyStr = typeof (requestBody) === "string" ?
      requestBody :
      JSON.stringify(requestBody);
    const sigBaseString = `v0:${slackRequestTimestamp}:${requestBodyStr}`;
    const sha256Hex = crypto.createHmac("sha256", slackSigningSecret)
      .update(sigBaseString, "utf8")
      .digest("hex");
    const mySignature = `v0=${sha256Hex}`;
    if (crypto.timingSafeEqual(Buffer.from(mySignature, "utf8"), Buffer.from(slackSignature, "utf8"))) {
      $.export("$summary", `Successfully verified the request with "${slackSignature}" signature`);
      return {
        success: true,
      };
    }
    $.export("$summary", "Slack signature mismatch with provided properties, it may be a configuration issue.");
    return {
      success: false,
    };
  },
};
