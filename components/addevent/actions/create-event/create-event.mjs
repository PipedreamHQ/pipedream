import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-create-event",
  name: "Create Event",
  description: "Creates a new instance of an event. [See the documentation](https://docs.addevent.com/reference/create-event)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    addevent,
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start date & time of the event.",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end date & time of the event.",
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
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "The attendees of the event.",
      optional: true,
    },
    calendarId: {
      propDefinition: [
        addevent,
        "calendarId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addevent.createEvent({
      calendarId: this.calendarId,
      eventName: this.eventName,
      startTime: this.startTime,
      endTime: this.endTime,
      location: this.location,
      description: this.description,
      attendees: this.attendees,
    });
    $.export("$summary", `Created event ${this.eventName}`);
    return response;
  },
};
