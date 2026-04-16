import app from "../../ical.app.mjs";

export default {
  name: "Delete Event",
  version: "0.0.1",
  key: "ical-delete-event",
  description: "Delete an event in a calendar. [See the documentation](https://icalendar.org/)",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    eventUID: {
      propDefinition: [
        app,
        "eventUID",
      ],
      description: "The UID of the event to delete",
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteEvent({
      $,
      uid: this.eventUID,
    });

    $.export("$summary", `Successfully deleted event with UID \`${this.eventUID}\``);

    return response;
  },
};
