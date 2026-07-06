import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-respond-to-event",
  name: "Respond to Event Invitation",
  description: "Accept, decline, or tentatively accept a Google Calendar event invitation on behalf of the authenticated user. Use this when you need to RSVP to an event. You can identify the event by its exact `eventId` or by `eventName` (searches upcoming events by title). If both are provided, `eventId` takes precedence. The `calendarId` defaults to `primary` (the user's main calendar). [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/patch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    calendarId: {
      propDefinition: [
        app,
        "calendarId",
      ],
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to respond to. Use this when you have the exact event ID. If you only have the event title, use `eventName` instead.",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The title (summary) of the event to respond to. Used to search for the event when you don't have the event ID. A case-insensitive search is performed and the first matching upcoming event is used.",
      optional: true,
    },
    responseStatus: {
      type: "string",
      label: "Response Status",
      description: "Your RSVP response to the event invitation.",
      options: [
        {
          label: "Accept",
          value: "accepted",
        },
        {
          label: "Decline",
          value: "declined",
        },
        {
          label: "Tentatively Accept",
          value: "tentative",
        },
      ],
    },
    sendUpdates: {
      propDefinition: [
        app,
        "sendUpdates",
      ],
      default: "all",
      description: "Whether to send notification emails to the organizer and other attendees. Defaults to `all` (notify everyone).",
    },
  },
  async run({ $ }) {
    const calendarId = this.calendarId || "primary";

    // Get the current user's email from the primary calendar
    const primaryCalendar = await this.app.getCalendar({
      calendarId: "primary",
    });
    const userEmail = primaryCalendar.id;

    // Resolve event: use provided ID (GET the full event) or search by name
    let event;
    let resolvedEventId = this.eventId;
    if (resolvedEventId) {
      event = await this.app.getEvent({
        calendarId,
        eventId: resolvedEventId,
      });
    } else {
      if (!this.eventName) {
        throw new ConfigurationError("Either `eventId` or `eventName` must be provided.");
      }
      const searchResults = await this.app.listEvents({
        calendarId,
        q: this.eventName,
        singleEvents: true,
        orderBy: "startTime",
        timeMin: new Date().toISOString(),
        maxResults: 10,
      });
      event = (searchResults.items || []).find(
        (item) => item.summary?.toLowerCase().includes(this.eventName.toLowerCase()),
      );
      if (!event) {
        throw new Error(`No upcoming event found matching "${this.eventName}".`);
      }
      resolvedEventId = event.id;
    }

    // Build updated attendees list — update existing entry or add user if not present
    const existingAttendees = event.attendees || [];
    const userEmailLower = userEmail.toLowerCase();
    const userIsAttendee = existingAttendees.some((a) => a.email?.toLowerCase() === userEmailLower);
    const attendees = userIsAttendee
      ? existingAttendees.map((attendee) =>
        attendee.email?.toLowerCase() === userEmailLower
          ? {
            ...attendee,
            responseStatus: this.responseStatus,
          }
          : attendee)
      : [
        ...existingAttendees,
        {
          email: userEmail,
          responseStatus: this.responseStatus,
        },
      ];

    // PATCH the event with the updated attendees
    const response = await this.app.patchEvent({
      calendarId,
      eventId: resolvedEventId,
      sendUpdates: this.sendUpdates,
      requestBody: {
        attendees,
      },
    });

    const statusLabel = {
      accepted: "accepted",
      declined: "declined",
      tentative: "tentatively accepted",
    }[this.responseStatus] || this.responseStatus;

    $.export("$summary", `${statusLabel} "${response.summary || resolvedEventId}"`);

    return response;
  },
};
