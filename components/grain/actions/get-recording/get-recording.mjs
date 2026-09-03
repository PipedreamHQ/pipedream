import grain from "../../grain.app.mjs";

export default {
  key: "grain-get-recording",
  name: "Get Recording",
  description: "Fetches a specific recording by its ID from Grain, returning its metadata (title, times, URL, tags, teams, meeting type)."
    + " Enable the optional include props to add highlights, participants, AI action items, AI summary, calendar event, HubSpot data, or screenshares to the response."
    + " Use **List Recordings** to find recording IDs, and **Get Transcript** to fetch the full transcript."
    + " [See the documentation](https://developers.grain.com)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
    recordingId: {
      propDefinition: [
        grain,
        "recordingId",
      ],
    },
    highlights: {
      propDefinition: [
        grain,
        "highlights",
      ],
    },
    participants: {
      propDefinition: [
        grain,
        "participants",
      ],
    },
    aiActionItems: {
      propDefinition: [
        grain,
        "aiActionItems",
      ],
    },
    aiSummary: {
      propDefinition: [
        grain,
        "aiSummary",
      ],
    },
    calendarEvent: {
      propDefinition: [
        grain,
        "calendarEvent",
      ],
    },
    hubspot: {
      propDefinition: [
        grain,
        "hubspot",
      ],
    },
    screenshares: {
      type: "boolean",
      label: "Include Screenshares",
      description: "Include the recording's screenshare ranges in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const include = {
      highlights: this.highlights,
      participants: this.participants,
      ai_action_items: this.aiActionItems,
      ai_summary: this.aiSummary,
      calendar_event: this.calendarEvent,
      hubspot: this.hubspot,
      screenshares: this.screenshares,
    };

    const response = await this.grain.fetchRecording({
      $,
      recordingId: this.recordingId,
      data: {
        include: Object.fromEntries(Object.entries(include).filter(([
          , value,
        ]) => value)),
      },
    });

    $.export("$summary", `Successfully fetched recording with ID ${this.recordingId}`);
    return response;
  },
};
