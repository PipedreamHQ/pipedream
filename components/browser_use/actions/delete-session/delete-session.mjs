import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-delete-session",
  name: "Delete Session",
  description: "Delete an agent session. [See the documentation](https://docs.browser-use.com/cloud/api-v3/sessions/delete-session)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.browserUse.deleteSession({
      $,
      sessionId: this.sessionId,
    });

    $.export("$summary", `Deleted session ${this.sessionId}`);
    return response;
  },
};
