// x-pd-ai: optimized
import googleMeet from "../../google_meet.app.mjs";

// Page size for the underlying Calendar events.list request. Fetched pages are
// filtered down to Meet events, so this is decoupled from the user's Max Results
// (the target count of filtered meetings).
const PAGE_SIZE = 2500;

export default {
  key: "google_meet-list-meetings",
  name: "List Meetings",
  description: "List upcoming Google Meet meetings on a calendar. Use this to discover meetings and their IDs. Returns Calendar events that have a Google Meet link, ordered by start time; by default only meetings that have not yet ended are returned. Narrow the window with the optional RFC 3339 time bounds. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleMeet,
    calendarId: {
      propDefinition: [
        googleMeet,
        "calendarId",
      ],
    },
    timeMin: {
      label: "Time Minimum",
      type: "string",
      description: "Only return meetings whose end time is after this time, formatted as [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1) (e.g. `2026-07-27T00:00:00Z`). Defaults to the current time, so upcoming and in-progress meetings are returned.",
      optional: true,
    },
    timeMax: {
      label: "Latest Start Time",
      type: "string",
      description: "Only return meetings that start before this time, formatted as [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1) (e.g. `2026-08-27T00:00:00Z`).",
      optional: true,
    },
    q: {
      label: "Search Query",
      type: "string",
      description: "Free-text search terms to filter meetings (matches summary, description, location, attendees, and more).",
      optional: true,
    },
    maxResults: {
      label: "Max Results",
      type: "integer",
      description: "The maximum number of meetings to return.",
      optional: true,
      default: 100,
      min: 1,
      max: 2500,
    },
  },
  methods: {
    isMeetEvent(event) {
      return event.conferenceData?.conferenceSolution?.key?.type === "hangoutsMeet"
        || Boolean(event.hangoutLink);
    },
  },
  async run({ $ }) {
    const timeMin = this.timeMin || new Date().toISOString();
    const meetings = [];
    let pageToken;

    do {
      const response = await this.googleMeet.listEvents({
        calendarId: this.calendarId,
        timeMin,
        timeMax: this.timeMax || undefined,
        q: this.q || undefined,
        maxResults: PAGE_SIZE,
        singleEvents: true,
        orderBy: "startTime",
        pageToken,
      });
      meetings.push(...(response.items || []).filter((event) => this.isMeetEvent(event)));
      pageToken = response.nextPageToken;
    } while (pageToken && meetings.length < this.maxResults);

    const results = meetings.slice(0, this.maxResults);

    $.export("$summary", `Found ${results.length} meeting${results.length === 1
      ? ""
      : "s"} with a Google Meet link`);

    return results;
  },
};
