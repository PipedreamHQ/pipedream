import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-update-event",
  name: "Update Event",
  description: "Updates the details of an existing event in WaiverFile",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    waiverfile,
    eventID: {
      propDefinition: [
        waiverfile,
        "eventID",
      ],
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The new name for the event",
      optional: true,
    },
    eventDescription: {
      type: "string",
      label: "Event Description",
      description: "The new description for the event",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The new date for the event",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.waiverfile.updateEvent({
      eventID: this.eventID,
      eventName: this.eventName,
      eventDescription: this.eventDescription,
      date: this.date,
    });
    $.export("$summary", `Successfully updated event with ID ${this.eventID}`);
    return response;
  },
};
