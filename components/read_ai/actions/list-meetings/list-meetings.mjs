import app from "../../read_ai.app.mjs";

export default {
  key: "read_ai-list-meetings",
  name: "List Meetings",
  description:
    "Retrieves a paginated list of meetings from Read AI, ordered by most recent first."
    + " Use this to browse meeting history or to find a specific meeting before calling **Get Meeting** for full details."
    + " Supports date range filtering via Unix millisecond timestamps."
    + " Returns meeting metadata including ID, title, participants, platform (Zoom/Teams/Google Meet), start time, and duration."
    + " The `nextCursor` field in the response can be passed to the `cursor` parameter to retrieve the next page."
    + " To convert a human date to Unix ms, multiply Unix seconds by 1000 (e.g. 7 days ago = `Date.now() - 7*24*60*60*1000`)."
    + " [See the documentation](https://support.read.ai/hc/en-us/articles/49381161088659-API-Reference)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startTimeMs: {
      type: "string",
      label: "Start Time (ms)",
      description: "Filter meetings that started at or after this Unix timestamp in milliseconds. Example: `1700000000000` for a fixed date, or compute relative times like 7 days ago.",
      optional: true,
    },
    endTimeMs: {
      type: "string",
      label: "End Time (ms)",
      description: "Filter meetings that started at or before this Unix timestamp in milliseconds.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listMeetings({
      $,
      startTimeMs: this.startTimeMs
        ? Number(this.startTimeMs)
        : undefined,
      endTimeMs: this.endTimeMs
        ? Number(this.endTimeMs)
        : undefined,
      limit: this.limit,
      cursor: this.cursor,
    });

    const meetings = response?.meetings ?? [];
    $.export("$summary", `Retrieved ${meetings.length} meeting${meetings.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
