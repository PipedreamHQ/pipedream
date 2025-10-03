import app from "../../airtop.app.mjs";

export default {
  key: "airtop-end-session",
  name: "End Session",
  description: "End a browser session. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/sessions/terminate)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
  },
  async run({ $ }) {
    const { sessionId } = this;

    const response = await this.app.endSession({
      $,
      sessionId,
    });

    $.export("$summary", `Successfully terminated session \`${sessionId}\``);
    return response;
  },
};

