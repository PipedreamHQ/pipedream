import app from "../../read_ai.app.mjs";

export default {
  key: "read_ai-get-meeting",
  name: "Get Meeting",
  description:
    "Retrieves complete details for a single Read AI meeting, including optional content expansions."
    + " Use **List Meetings** first to find the meeting ID."
    + " By default returns only meeting metadata (title, participants, platform, start/end time, duration)."
    + " Enable specific expansions to include richer content — only request what you need to keep response size manageable:"
    + " `include_summary` for the AI-generated overview;"
    + " `include_action_items` for extracted tasks;"
    + " `include_transcript` for the full word-for-word transcript with speaker attribution (can be large);"
    + " `include_key_questions` for AI-flagged discussion questions;"
    + " `include_topics` for identified subject areas;"
    + " `include_metrics` for speaker engagement data (talk time, interruptions);"
    + " `include_recording_download` for a presigned URL to download the meeting recording."
    + " [See the documentation](https://support.read.ai/hc/en-us/articles/49381161088659-API-Reference#h_01KJ7HW2S95B1D9Z7BS88M3JBJ)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    meetingId: {
      propDefinition: [
        app,
        "meetingId",
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

    const meeting = await this.app.getMeeting({
      $,
      meetingId: this.meetingId,
      expand,
    });

    const title = meeting?.title ?? meeting?.id ?? this.meetingId;
    $.export("$summary", `Retrieved meeting: ${title}`);
    return meeting;
  },
};
