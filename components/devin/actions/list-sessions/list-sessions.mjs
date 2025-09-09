import devin from "../../devin.app.mjs";

export default {
  key: "devin-list-sessions",
  name: "List Sessions",
  description: "Retrieve a list of all sessions. [See the documentation](https://docs.devin.ai/api-reference/sessions/list-sessions)",
  version: "0.0.1",
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
        tags: this.tags,
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.sessions?.length || 0} sessions`);
    return response;
  },
};
