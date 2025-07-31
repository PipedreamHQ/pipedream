import zep from "../../zep.app.mjs";

export default {
  key: "zep-get-sessions",
  name: "Get Sessions",
  description: "Returns all sessions. [See the documentation](https://help.getzep.com/sdk-reference/memory/list-sessions)",
  version: "0.0.1",
  type: "action",
  props: {
    zep,
  },
  async run({ $ }) {
    const response = await this.zep.listSessions({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.sessions.length} sessions`);
    return response;
  },
};
