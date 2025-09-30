import app from "../../spamcheck_ai.app.mjs";

export default {
  key: "spamcheck_ai-post-spam-report",
  name: "Spam Report",
  description: "Create a new spam report. [See the documentation](https://app.spamcheck.ai/api_docs/index.html)",
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
    desiredOutcome: {
      propDefinition: [
        app,
        "desiredOutcome",
      ],
    },
    result: {
      propDefinition: [
        app,
        "result",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.spamReport({
      $,
      data: {
        ip: this.ip,
        email: this.email,
        desired_outcome: this.desiredOutcome,
        result: this.result,
        notes: this.notes,
      },
    });
    $.export("$summary", "Successfully created a new spam report");
    return response;
  },
};
