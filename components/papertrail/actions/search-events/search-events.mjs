import papertrail from "../../papertrail.app.mjs";

export default {
  key: "papertrail-search-events",
  name: "Search Log Events",
  description:
    "Search Papertrail log events programmatically. Supports query syntax, system/group scope, time or ID bounds, limit, and tail mode. [See the documentation](https://www.papertrail.com/help/search-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    papertrail,
    q: {
      type: "string",
      label: "Query",
      description: "Search query (Papertrail search syntax). Omit to return recent events.",
      optional: true,
    },
    systemId: {
      propDefinition: [
        papertrail,
        "systemId",
      ],
    },
    groupId: {
      propDefinition: [
        papertrail,
        "groupId",
      ],
    },
    minId: {
      type: "string",
      label: "Min Event ID",
      description: "Oldest message ID to examine (64-bit ID as string).",
      optional: true,
    },
    maxId: {
      type: "string",
      label: "Max Event ID",
      description: "Newest message ID to examine.",
      optional: true,
    },
    minTime: {
      type: "integer",
      label: "Min Time (Unix)",
      description: "Oldest timestamp to examine (epoch seconds, UTC).",
      optional: true,
    },
    maxTime: {
      type: "integer",
      label: "Max Time (Unix)",
      description: "Newest timestamp to examine (epoch seconds, UTC).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum messages to return (default 1000, max 10,000).",
      optional: true,
      min: 1,
      max: 10000,
    },
    tail: {
      type: "boolean",
      label: "Tail",
      description:
        "When true, prioritizes recency (useful for live tail). Defaults to true when `min_id` is set without `max_id`/`max_time` on the API side.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.papertrail.searchEvents({
      $,
      params: {
        q: this.q,
        system_id: this.systemId,
        group_id: this.groupId,
        min_id: this.minId,
        max_id: this.maxId,
        min_time: this.minTime,
        max_time: this.maxTime,
        limit: this.limit,
        tail: this.tail,
      },
    });

    const count = response?.events?.length ?? 0;
    $.export(
      "$summary",
      `Returned ${count} event${count === 1
        ? ""
        : "s"}`,
    );
    return response;
  },
};
