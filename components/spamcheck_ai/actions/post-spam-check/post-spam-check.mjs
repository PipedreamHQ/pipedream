import app from "../../spamcheck_ai.app.mjs";

export default {
  key: "spamcheck_ai-post-spam-check",
  name: "Spam Check",
  description: "Post a new spam check for an email or IP. [See the documentation](https://app.spamcheck.ai/api_docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    ip: {
      propDefinition: [
        app,
        "ip",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.spamCheck({
      $,
      data: {
        ip: this.ip,
        email: this.email,
      },
    });
    $.export("$summary", `Successfully posted spam check with ID '${response.id}'`);
    return response;
  },
};
