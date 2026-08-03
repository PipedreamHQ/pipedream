import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";

export default {
  key: "google_calendar-add-attendees-to-event",
  name: "Add Attendees To Event",
  description: "Add one or more attendees (invitees) to an event that ALREADY EXISTS on a Google Calendar, without recreating it. New attendees are merged into the event's current attendee list — existing attendees are preserved, not replaced. Use this when the user wants to invite additional people to an event they already have; identify the target event with `eventId` first (e.g. via list-events or get-event). When creating a brand-new event, set its attendees directly in create-event instead of calling this afterward. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#patch)",
  version: "0.0.10",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    eventId: {
      propDefinition: [
        googleCalendar,
        "eventId",
        (c) => ({
          calendarId: c.calendarId,
        }),
      ],
    },
    attendees: {
      label: "Attendees",
      type: "string",
      description: "Enter either an array or a comma separated list of email addresses of attendees",
    },
    sendUpdates: {
      propDefinition: [
        googleCalendar,
        "sendUpdates",
      ],
    },
  },
  async run({ $ }) {
    const newAttendees = createEventCommon.methods.formatAttendees(this.attendees);
    const currentEvent = await this.googleCalendar.getEvent({
      eventId: this.eventId,
      calendarId: this.calendarId,
    });

    // Merge the requested attendees into the event's existing list. PATCH replaces
    // the `attendees` array wholesale, so we must send existing + new together;
    // existing attendee objects are preserved verbatim to keep their responseStatus.
    //
    // Order is deliberately NEW-FIRST, matching what this action has always returned —
    // callers read `attendees[0]` to get the invitee they just added. Only the duplicates
    // change: an address already on the event is no longer appended a second time, and the
    // copy that survives is the existing one, so its responseStatus is not reset to
    // needsAction.
    const existingAttendees = currentEvent?.attendees ?? [];
    const existingEmails = new Set(
      existingAttendees
        .map((a) => a.email?.toLowerCase())
        .filter(Boolean),
    );
    const attendeesToAdd = newAttendees.filter(
      (a) => !existingEmails.has(a.email.toLowerCase()),
    );
    const attendees = [
      ...attendeesToAdd,
      ...existingAttendees,
    ];

    // PATCH (not UPDATE/PUT) so we only touch `attendees` — avoids echoing back
    // read-only fields (iCalUID, etag, sequence, …) that a full PUT can reject.
    const response = await this.googleCalendar.patchEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      sendUpdates: this.sendUpdates,
      requestBody: {
        attendees,
      },
    });

    $.export("$summary", `Successfully added ${attendeesToAdd.length} attendee${attendeesToAdd.length === 1
      ? ""
      : "s"} to event: "${response.id}"`);
    return response;
  },
};
