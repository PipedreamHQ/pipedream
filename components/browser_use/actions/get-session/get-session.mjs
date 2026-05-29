import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-session",
  name: "Get Session",
  description: "Get the current state, output, live URL, screenshot URL, and cost details for an agent session. [See the documentation](https://docs.browser-use.com/cloud/api-v3/sessions/get-session)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    sessionId: {
      propDefinition: [
        browserUse,
        "sessionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.getSession({
      $,
      sessionId: this.sessionId,
    });

    $.export("$summary", `Retrieved session ${response.id} with status ${response.status}`);
    return response;
  },
};
