import app from "../../zoho_calendar.app.mjs";

export default {
  key: "zoho_calendar-create-event-smart-add",
  name: "Create event using Smart Add",
  description: "Create a new event in a particular calendar using Smart Add. [See the documentation](https://www.zoho.com/calendar/help/api/post-create-event-smart-add.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    eventDesc: {
      type: "string",
      label: "Event Description",
      description: "Create an event using Smart Add by providing normal text in natural language",
    },
  },
  async run({ $ }) {
    const result = await this.app.createEventSmartAdd({
      $,
      eventDesc: this.eventDesc,
    });

    $.export("$summary", "Successfully created event");

    return result;
  },
};
