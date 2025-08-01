import zep from "../../zep.app.mjs";

export default {
  key: "zep-get-session",
  name: "Get Session",
  description: "Returns the session with the specified ID. [See the documentation](https://help.getzep.com/sdk-reference/memory/get-session)",
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
    const response = await this.zep.getSession({
      $,
      sessionId: this.sessionId,
    });
    $.export("$summary", `Successfully retrieved the session with ID: ${this.sessionId}`);
    return response;
  },
};
