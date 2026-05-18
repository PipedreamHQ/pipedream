import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-many-sessions",
  name: "Get Many Sessions",
  description: "Retrieves a paginated list of Hedy meeting sessions ordered from most recent."
    + " Each session includes its title, start/end times, duration, and session type."
    + " Use this tool to browse recent meetings or to find a session ID to pass to **Get Session** for full transcript and summary details."
    + " To list sessions within a specific topic, use **Get Topic Sessions** instead."
    + " Paginate using the `after` cursor from the response's `pagination` field."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    after: {
      propDefinition: [
        app,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.limit) params.limit = this.limit;
    if (this.after) params.after = this.after;

    const response = await this.app.listSessions({
      $,
      params,
    });
    const sessions = response?.data || [];
    $.export("$summary", `Retrieved ${sessions.length} session${sessions.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
