import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-get-session",
  name: "Get Session",
  description: "Retrieve the details of a specific automation test session. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
    const response = await this.app.getSession({
      $,
      sessionId: this.sessionId,
    });

    $.export("$summary", `Successfully retrieved session ${this.sessionId}`);

    return response;
  },
};
