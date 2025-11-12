import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-create-event",
  name: "Create Event",
  description: "Creates a new instance of an event. [See the documentation](https://docs.addevent.com/reference/create-event)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addevent,
    title: {
      type: "string",
      label: "Event Title",
      description: "The title of the event.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start date & time of the event. Accepts datetimes in the following formats: `YYYY-MM-DD hh:mm:ss` e.g. 2023-11-28 10:00:00, `YYYY-MM-DD hh:mm` e.g. 2023-11-28 10:00, `YYYY-MM-DD` e.g. 2023-11-28",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end date & time of the event. Accepts datetimes in the following formats: `YYYY-MM-DD hh:mm:ss` e.g. 2023-11-28 10:00:00, `YYYY-MM-DD hh:mm` e.g. 2023-11-28 10:00, `YYYY-MM-DD` e.g. 2023-11-28. Defaults to `datetime_start + 1 hour` if not set.",
      optional: true,
    },
    timezone: {
      propDefinition: [
        addevent,
        "timezone",
      ],
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The event's location. This can be an address or a URL.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The event's description.",
      optional: true,
    },
    calendarId: {
      propDefinition: [
        addevent,
        "calendarId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.addevent.createEvent({
      data: {
        calendar_id: this.calendarId,
        title: this.title,
        datetime_start: this.startTime,
        datetime_end: this.endTime,
        timezone: this.timezone,
        location: this.location,
        description: this.description,
      },
      $,
    });
    $.export("$summary", `Successfully created event with ID ${response.id}.`);
    return response;
  },
};
