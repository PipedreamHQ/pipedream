import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-delete-event",
  name: "Delete Event",
  description: "Delete an event. [See the documentation](https://docs.add-to-calendar-pro.com/api/events#delete-an-event)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    addToCalendarPro,
    eventProKey: {
      propDefinition: [
        addToCalendarPro,
        "eventProKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.addToCalendarPro.deleteEvent({
      $,
      eventProKey: this.eventProKey,
    });
    $.export("$summary", "Successfully deleted event.");
    return response;
  },
};
