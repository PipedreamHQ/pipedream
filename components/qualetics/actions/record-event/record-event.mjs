import qualetics from "../../qualetics.app.mjs";

export default {
  key: "qualetics-record-event",
  name: "Record Event",
  description: "Inputs a new event record into the system. Requires 'event id' and 'event data' props. The 'event id' identifies the specific event type, while 'event data' holds information related to the event.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    qualetics,
    eventId: {
      propDefinition: [
        qualetics,
        "eventId",
      ],
    },
    eventData: {
      propDefinition: [
        qualetics,
        "eventData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.qualetics.recordEvent(this.eventId, this.eventData);
    $.export("$summary", `Successfully recorded event with ID: ${this.eventId}`);
    return response;
  },
};
