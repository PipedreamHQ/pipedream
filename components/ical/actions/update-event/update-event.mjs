import app from "../../ical.app.mjs";
import * as ical2json from "ical2json";

export default {
  name: "Update Event",
  version: "0.0.1",
  key: "ical-update-event",
  description: "Update an event in a calendar. [See the documentation](https://icalendar.org/)",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    eventUID: {
      propDefinition: [
        app,
        "eventUID",
      ],
      description: "The UID of the event to update",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Short title or summary of the event",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Detailed description or notes for the event",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Event start date/time (e.g. YYYYMMDDTHHMMSS or ISO 8601)",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "Event end date/time (e.g. YYYYMMDDTHHMMSS or ISO 8601)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { VCALENDAR } = await this.app.getEvent({
      uid: this.eventUID,
      $,
    });
    const event = VCALENDAR[0].VEVENT[0];
    if (!event) {
      throw new Error("Event not found");
    }
    const ics =
      [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Pipedream//CalDAV//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${this.eventUID}`,
        `DTSTAMP:${new Date().toISOString()}`,
        `DTSTART:${this.start || event.DTSTART}`,
        `DTEND:${this.end || event.DTEND}`,
        `SUMMARY:${this.summary || event.SUMMARY}`,
        `DESCRIPTION:${this.description || event.DESCRIPTION}`,
        "END:VEVENT",
        "END:VCALENDAR",
        "",
      ];

    await this.app.updateEvent({
      $,
      uid: this.eventUID,
      data: ics.join("\r\n"),
    });

    $.export("$summary", `Successfully updated event with UID \`${this.eventUID}\``);

    return ical2json.convert(ics.join("\r\n"));
  },
};
