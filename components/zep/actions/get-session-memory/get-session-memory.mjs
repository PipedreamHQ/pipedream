import zep from "../../zep.app.mjs";

export default {
  key: "zep-get-session-memory",
  name: "Get Session Memory",
  description: "Returns a memory for the session with the specified ID. [See the documentation](https://help.getzep.com/sdk-reference/memory/get)",
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
    const response = await this.zep.listSessionMemory({
      $,
      sessionId: this.sessionId,
    });
    $.export("$summary", `Successfully retrieved memory for the session with ID: ${this.sessionId}`);
    return response;
  },
};
