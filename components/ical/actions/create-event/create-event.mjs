import app from "../../ical.app.mjs";
import * as ical2json from "ical2json";

export default {
  name: "Create Event",
  version: "0.0.1",
  key: "ical-create-event",
  description: "Create an event in a calendar. [See the documentation](https://icalendar.org/)",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    summary: {
      type: "string",
      label: "Summary",
      description: "Short title or summary of the event",
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
    },
    end: {
      type: "string",
      label: "End",
      description: "Event end date/time (e.g. YYYYMMDDTHHMMSS or ISO 8601)",
    },
  },
  async run({ $ }) {
    const uid = `pd-${Date.now()}`;

    const ics =
      [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Pipedream//CalDAV//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${new Date().toISOString()}`,
        `DTSTART:${this.start}`,
        `DTEND:${this.end}`,
        `SUMMARY:${this.summary}`,
        `DESCRIPTION:${this.description || "No description provided"}`,
        "END:VEVENT",
        "END:VCALENDAR",
        "",
      ];

    await this.app.createEvent({
      $,
      uid,
      data: ics.join("\r\n"),
    });

    $.export("$summary", `Successfully created event with UID \`${uid}\``);

    return ical2json.convert(ics.join("\r\n"));
  },
};
