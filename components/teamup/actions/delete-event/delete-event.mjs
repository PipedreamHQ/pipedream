import teamup from "../../teamup.app.mjs";

export default {
  key: "teamup-delete-event",
  name: "Delete Event",
  description: "Deletes an existing event on a specified calendar. [See the documentation](https://apidocs.teamup.com/docs/api/260f3631bec7b-delete-an-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamup,
    calendarKey: {
      propDefinition: [
        teamup,
        "calendarKey",
      ],
    },
    eventId: {
      propDefinition: [
        teamup,
        "eventId",
        (c) => ({
          calendarKey: c.calendarKey,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.teamup.deleteEvent({
      calendarKey: this.calendarKey,
      eventId: this.eventId,
      $,
    });

    $.export("$summary", `Successfully deleted event with id ${this.eventId}`);

    return response;
  },
};
