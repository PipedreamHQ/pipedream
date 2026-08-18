import googleCalendar from "../../google_calendar.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

// Top-level fields an Events resource can carry. Used ONLY to validate the `fields`
// prop, so a plausible-but-wrong guess (`title`, `name`, `time`) fails with a list of
// what is valid instead of silently returning events that contain nothing but an id.
const EVENT_RESOURCE_FIELDS = [
  "anyoneCanAddSelf",
  "attachments",
  "attendees",
  "attendeesOmitted",
  "birthdayProperties",
  "colorId",
  "conferenceData",
  "created",
  "creator",
  "description",
  "end",
  "endTimeUnspecified",
  "etag",
  "eventType",
  "extendedProperties",
  "focusTimeProperties",
  "gadget",
  "guestsCanInviteOthers",
  "guestsCanModify",
  "guestsCanSeeOtherGuests",
  "hangoutLink",
  "htmlLink",
  "iCalUID",
  "id",
  "kind",
  "location",
  "locked",
  "organizer",
  "originalStartTime",
  "outOfOfficeProperties",
  "privateCopy",
  "recurrence",
  "recurringEventId",
  "reminders",
  "sequence",
  "source",
  "start",
  "status",
  "summary",
  "transparency",
  "updated",
  "visibility",
  "workingLocationProperties",
];

// What `fields: "compact"` expands to — enough to answer "what's on my calendar",
// nothing more. Measured against a real week: the full resource ran ~9 KB per event
// (long descriptions and attendee lists dominate); this is well under 100 bytes.
const COMPACT_FIELDS = [
  "summary",
  "start",
  "end",
  "status",
  "location",
];

export default {
  key: "google_calendar-list-events",
  name: "List Events",
  description: "List or search the events on a Google Calendar. Use this for \"what's on my calendar\", \"what's my schedule/agenda\", \"what's coming up\", \"am I busy/free\", or any question about the events in a date range: set `timeMin`/`timeMax` for the window, `q` to search event text, and `singleEvents` to `true` to expand recurring events into individual occurrences. **Response size matters here:** by default every field of every matching event is returned, which runs 2-10 KB per event (long descriptions, full attendee lists, HTML links), so one busy week can exceed 100 KB and overflow an AI agent's context window. Request only what the question needs — `fields: \"compact\"` (equivalently `fields: \"summary,start,end\"`) answers a schedule question in a fraction of the bytes, and `maxAttendees: 1` drops guest lists when the question is not about who is attending. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    fields: {
      type: "string",
      label: "Fields",
      description: "Which fields to return for each event, as a comma-separated list (e.g. `summary,start,end`) — use this to keep the response small enough to work with. Shorthand: `compact` returns `summary,start,end,status,location`, which is what a \"what's on my calendar\" / schedule question needs. Add `attendees` only when the question is about who is invited, `description` only when the event's notes are needed, and `htmlLink` only when a link back to Google Calendar is requested — those three are what make responses large. The event's `id` is always returned, so the event can still be updated, deleted, or responded to without listing again. **Leave blank to return the complete event resource** (the default, and the largest possible response).",
      optional: true,
    },
    iCalUID: {
      propDefinition: [
        googleCalendar,
        "iCalUID",
      ],
    },
    maxAttendees: {
      propDefinition: [
        googleCalendar,
        "maxAttendees",
      ],
      description: "The maximum number of attendees to include per event. Leave unset and EVERY attendee of every event is returned — on events with large invite lists this is usually the single largest part of the response. Set to `1` when the question isn't about who is attending (only the authenticated user is returned).",
    },
    maxResults: {
      propDefinition: [
        googleCalendar,
        "maxResults",
      ],
    },
    orderBy: {
      propDefinition: [
        googleCalendar,
        "orderBy",
      ],
      default: "",
    },
    privateExtendedProperty: {
      propDefinition: [
        googleCalendar,
        "privateExtendedProperty",
      ],
    },
    q: {
      propDefinition: [
        googleCalendar,
        "q",
      ],
    },
    sharedExtendedProperty: {
      propDefinition: [
        googleCalendar,
        "sharedExtendedProperty",
      ],
    },
    showDeleted: {
      propDefinition: [
        googleCalendar,
        "showDeleted",
      ],
    },
    showHiddenInvitations: {
      propDefinition: [
        googleCalendar,
        "showHiddenInvitations",
      ],
    },
    singleEvents: {
      propDefinition: [
        googleCalendar,
        "singleEvents",
      ],
    },
    timeMax: {
      propDefinition: [
        googleCalendar,
        "timeMax",
      ],
    },
    timeMin: {
      propDefinition: [
        googleCalendar,
        "timeMin",
      ],
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
    },
    updatedMin: {
      propDefinition: [
        googleCalendar,
        "updatedMin",
      ],
    },
    eventTypes: {
      propDefinition: [
        googleCalendar,
        "eventTypes",
      ],
    },
  },
  methods: {
    /**
     * The `fields` prop parsed into a list of event field names, or `undefined`
     * when it is blank — blank is the default and means "return the whole event
     * resource", which is what existing callers already read.
     */
    requestedFields() {
      const raw = this.fields?.trim();
      if (!raw) {
        return undefined;
      }
      if (raw.toLowerCase() === "compact") {
        return COMPACT_FIELDS;
      }
      return raw
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean);
    },
    /**
     * Narrow each event to the requested fields. Returns the events untouched when
     * no fields were requested, so the default response shape is unchanged.
     */
    projectEvents(events) {
      const fields = this.requestedFields();
      if (!fields?.length) {
        return events;
      }

      // Validate against the known resource fields UNION what the API actually
      // returned, so a field Google adds after this component ships is accepted
      // rather than rejected as a typo.
      const known = new Set([
        ...EVENT_RESOURCE_FIELDS,
        ...events.flatMap((event) => Object.keys(event)),
      ]);
      const unknown = fields.filter((field) => !known.has(field));
      if (unknown.length) {
        throw new ConfigurationError(`Unknown value(s) in Fields: ${unknown.join(", ")}. Use \`compact\`, or a comma-separated subset of: ${EVENT_RESOURCE_FIELDS.join(", ")}. Leave Fields blank to return every field.`);
      }

      return events.map((event) => {
        // `id` is always included: update-event, delete-event and respond-to-event
        // all need it, and an agent that trimmed it away would have to list again.
        const projected = {
          id: event.id,
        };
        for (const field of fields) {
          if (field !== "id" && event[field] !== undefined) {
            projected[field] = event[field];
          }
        }
        return projected;
      });
    },
  },
  async run({ $ }) {
    if (this.orderBy === "startTime" && !this.singleEvents) {
      throw new ConfigurationError("Single Events must be `true` to order by `startTime`");
    }

    if (this.updatedMin === "") this.updatedMin = undefined;

    const args = utils.filterEmptyValues({
      calendarId: this.calendarId,
      iCalUID: this.iCalUID,
      maxAttendees: this.maxAttendees,
      orderBy: this.orderBy || undefined,
      privateExtendedProperty: this.privateExtendedProperty,
      q: this.q,
      sharedExtendedProperty: this.sharedExtendedProperty,
      showDeleted: this.showDeleted,
      showHiddenInvitations: this.showHiddenInvitations,
      singleEvents: this.singleEvents,
      timeMax: this.timeMax,
      timeMin: this.timeMin,
      timeZone: this.timeZone,
      updatedMin: this.updatedMin,
      eventTypes: this.eventTypes,
    });

    const events = [];
    do {
      const {
        items, nextPageToken,
      } = await this.googleCalendar.listEvents(args);
      events.push(...items);
      args.pageToken = nextPageToken;
    } while (args.pageToken && (!this.maxResults || events.length < this.maxResults));
    if (events.length > this.maxResults) {
      events.length = this.maxResults;
    }

    for (const event of events) {
      if (!event.summary) {
        event.summary = `Event ID: ${event.id}`;
      }
    }

    const results = this.projectEvents(events);

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return results;
  },
};
