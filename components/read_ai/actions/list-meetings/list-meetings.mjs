import app from "../../read_ai.app.mjs";

export default {
  key: "read_ai-list-meetings",
  name: "List Meetings",
  description:
    "Retrieves a paginated list of meetings from Read AI, ordered by most recent first."
    + " Use this to browse meeting history or to find a specific meeting before calling **Get Meeting** for full details."
    + " Supports date range filtering via Unix millisecond timestamps."
    + " Returns meeting metadata including ID, title, participants, platform (Zoom/Teams/Google Meet), start time, and duration."
    + " Use the expand options to include richer content (summary, action items, transcript, etc.) directly in the listing — note that active meetings will have limited or no data for expanded fields, as these are generated after a meeting concludes."
    + " When `has_more` is `true` in the response, pass the `id` of the last meeting in the `data` array to the `cursor` parameter to retrieve the next page."
    + " To convert a human date to Unix ms, multiply Unix seconds by 1000 (e.g. 7 days ago = `Date.now() - 7*24*60*60*1000`)."
    + " [See the documentation](https://support.read.ai/hc/en-us/articles/49381161088659-API-Reference#h_01KJ7HW2RMF7VS2EHTXAWS4BJ7)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startTimeMs: {
      type: "integer",
      label: "Start Time (ms)",
      description: "Filter meetings that started at or after this Unix timestamp in milliseconds. Example: `1700000000000` for a fixed date, or compute relative times like 7 days ago.",
      optional: true,
    },
    endTimeMs: {
      type: "integer",
      label: "End Time (ms)",
      description: "Filter meetings that started at or before this Unix timestamp in milliseconds. Example: `1700000000000`.",
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
    includeSummary: {
      type: "boolean",
      label: "Include Summary",
      description: "Include the AI-generated meeting summary and chapter summaries.",
      default: false,
      optional: true,
    },
    includeActionItems: {
      type: "boolean",
      label: "Include Action Items",
      description: "Include extracted action items with implied owners.",
      default: false,
      optional: true,
    },
    includeTranscript: {
      type: "boolean",
      label: "Include Transcript",
      description: "Include the full word-for-word transcript with speaker attribution. Can be very large for long meetings.",
      default: false,
      optional: true,
    },
    includeKeyQuestions: {
      type: "boolean",
      label: "Include Key Questions",
      description: "Include key questions flagged by AI during the meeting.",
      default: false,
      optional: true,
    },
    includeTopics: {
      type: "boolean",
      label: "Include Topics",
      description: "Include identified discussion topics and subject areas.",
      default: false,
      optional: true,
    },
    includeMetrics: {
      type: "boolean",
      label: "Include Metrics",
      description: "Include speaker engagement metrics: talk time, interruptions, engagement scores.",
      default: false,
      optional: true,
    },
    includeRecordingDownload: {
      type: "boolean",
      label: "Include Recording Download URL",
      description: "Include a presigned URL to download the meeting recording.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const expand = [];
    if (this.includeSummary) expand.push("summary");
    if (this.includeActionItems) expand.push("action_items");
    if (this.includeTranscript) expand.push("transcript");
    if (this.includeKeyQuestions) expand.push("key_questions");
    if (this.includeTopics) expand.push("topics");
    if (this.includeMetrics) expand.push("metrics");
    if (this.includeRecordingDownload) expand.push("recording_download");

    const response = await this.app.listMeetings({
      $,
      startTimeMs: this.startTimeMs,
      endTimeMs: this.endTimeMs,
      limit: this.limit,
      cursor: this.cursor,
      expand,
    });

    const meetings = response?.data ?? [];
    $.export("$summary", `Retrieved ${meetings.length} meeting${meetings.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
