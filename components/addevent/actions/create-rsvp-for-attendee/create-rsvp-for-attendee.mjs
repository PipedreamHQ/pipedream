import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-create-rsvp-for-attendee",
  name: "Create RSVP For Attendee",
  description: "Creates an RSVP for an attendee for a specific event. [See the documentation](https://docs.addevent.com/reference/create-rsvp-attendee)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    addevent,
    eventId: {
      propDefinition: [
        addevent,
        "eventId",
      ],
    },
    attendees: {
      propDefinition: [
        addevent,
        "attendees",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addevent.createRsvp({
      eventId: this.eventId,
      attendees: this.attendees,
    });
    $.export("$summary", `Successfully created RSVP for ${this.attendees.length} attendee(s)`);
    return response;
  },
};
