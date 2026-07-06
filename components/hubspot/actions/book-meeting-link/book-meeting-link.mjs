import { ConfigurationError } from "@pipedream/platform";
import hubspot from "../../hubspot.app.mjs";

const MS_PER_MINUTE = 60 * 1000;

export default {
  key: "hubspot-book-meeting-link",
  name: "Book Meeting on Meeting Link",
  description: "Book a meeting on a HubSpot meeting scheduling page. Creates a calendar event for the organizer and registers the booker as a contact. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/scheduler/guide#book-a-meeting)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    slug: {
      propDefinition: [
        hubspot,
        "meetingLinkSlug",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the booker.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the booker.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the booker.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Meeting start time as an ISO 8601 string (e.g. `2026-06-15T14:00:00Z`) or a Unix epoch timestamp in milliseconds (not seconds).",
    },
    durationMinutes: {
      type: "integer",
      label: "Duration (minutes)",
      description: "Meeting length in minutes. Must match a duration offered by the meeting link (run **Get Meeting Link Booking Info** to see valid durations).",
      min: 1,
    },
    timezone: {
      propDefinition: [
        hubspot,
        "meetingTimezone",
      ],
      description: "IANA timezone of the booker (e.g. `America/New_York`).",
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Language preference for the confirmation (e.g. `en-us`).",
      optional: true,
      default: "en-us",
    },
    guestEmails: {
      type: "string[]",
      label: "Guest Emails",
      description: "Additional attendee email addresses to invite.",
      optional: true,
    },
    likelyAvailableUserIds: {
      type: "string[]",
      label: "Likely Available User IDs",
      description: "Preferred organizer User IDs for round-robin meeting links.",
      optional: true,
    },
  },
  methods: {
    parseStartTime(value) {
      if (typeof value === "number") {
        return value;
      }
      if (/^\d+$/.test(value)) {
        return Number.parseInt(value, 10);
      }
      const ms = Date.parse(value);
      if (Number.isNaN(ms)) {
        throw new ConfigurationError(
          `Could not parse Start Time "${value}". Provide an ISO 8601 string or a Unix epoch in milliseconds.`,
        );
      }
      return ms;
    },
  },
  async run({ $ }) {
    const startTime = this.parseStartTime(this.startTime);
    const duration = this.durationMinutes * MS_PER_MINUTE;

    const response = await this.hubspot.bookMeetingLink({
      $,
      params: {
        timezone: this.timezone,
      },
      data: {
        slug: this.slug,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        startTime,
        duration,
        timezone: this.timezone,
        locale: this.locale,
        guestEmails: this.guestEmails,
        likelyAvailableUserIds: this.likelyAvailableUserIds,
      },
    });

    const summary = response?.isOffline
      ? `Recorded offline booking for ${this.email} on "${this.slug}" (no calendar event created)`
      : `Booked meeting ${response?.calendarEventId
        ? `(${response.calendarEventId}) `
        : ""}for ${this.email} on "${this.slug}"`;

    $.export("$summary", summary);

    return response;
  },
};
