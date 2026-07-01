import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-list-agents",
  name: "List Agents",
  description: "Retrieves a list of agents. [See the documentation](https://elevenlabs.io/docs/eleven-agents/api-reference/agents/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elevenlabs,
    search: {
      type: "string",
      label: "Search",
      description: "Search agents by name.",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "How many agents to fetch per request (cannot exceed 100). The action still pages through all results.",
      optional: true,
      default: 30,
      min: 1,
      max: 100,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter agents by archived status.",
      optional: true,
    },
    createdByUserId: {
      type: "string",
      label: "Created By User ID",
      description: "Filter agents by the creator's user ID. Use `@me` for the authenticated user.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort the results by.",
      optional: true,
      options: [
        "name",
        "created_at",
        "call_count_7d",
      ],
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort the results by.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
  },
  async run({ $ }) {
    const {
      elevenlabs,
      search,
      pageSize,
      archived,
      createdByUserId,
      sortBy,
      sortDirection,
    } = this;
    const results = [];
    let cursor;
    do {
      const {
        agents, next_cursor: nextCursor,
      } = await elevenlabs.listAgents({
        $,
        params: {
          search,
          page_size: pageSize,
          archived,
          created_by_user_id: createdByUserId,
          sort_by: sortBy,
          sort_direction: sortDirection,
          cursor,
        },
      });
      results.push(...agents);
      cursor = nextCursor;
    } while (cursor);
    $.export("$summary", `Successfully retrieved ${results.length} agent${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
