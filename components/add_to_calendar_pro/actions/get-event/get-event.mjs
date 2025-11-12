import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-get-event",
  name: "Get Event",
  description: "Get an event. [See the documentation](https://docs.add-to-calendar-pro.com/api/events#get-one-event)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.addToCalendarPro.getEvent({
      $,
      eventProKey: this.eventProKey,
    });
    $.export("$summary", "Successfully retrieved event.");
    return response;
  },
};
