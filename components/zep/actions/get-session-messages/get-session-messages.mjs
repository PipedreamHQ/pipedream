import zep from "../../zep.app.mjs";

export default {
  key: "zep-get-session-messages",
  name: "Get Session Messages",
  description: "Returns messages for the session with the specified ID. [See the documentation](https://help.getzep.com/sdk-reference/memory/get-session-messages)",
  version: "0.0.1",
  type: "action",
  props: {
    zep,
    sessionId: {
      propDefinition: [
        zep,
        "sessionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zep.listMessages({
      $,
      sessionId: this.sessionId,
    });
    $.export("$summary", `Successfully retrieved messages for the session with ID: ${this.sessionId}`);
    return response;
  },
};
