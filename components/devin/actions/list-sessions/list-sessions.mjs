import devin from "../../devin.app.mjs";

export default {
  key: "devin-list-sessions",
  name: "List Sessions",
  description: "Retrieve a list of all sessions. [See the documentation](https://docs.devin.ai/api-reference/sessions/list-sessions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    devin,
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Filter sessions by specific tags",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of sessions to retrieve",
      optional: true,
      default: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of sessions to skip",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const response = await this.devin.listSessions({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    let sessions = response.sessions;
    if (this.tags) {
      sessions = sessions.filter((session) => session.tags.some((tag) => this.tags.includes(tag)));
    }

    let summary = `Retrieved ${response.sessions.length} sessions`;
    if (this.tags) {
      summary += `, ${sessions.length} matching tags`;
    }

    $.export("$summary", `${summary}`);
    return sessions;
  },
};
