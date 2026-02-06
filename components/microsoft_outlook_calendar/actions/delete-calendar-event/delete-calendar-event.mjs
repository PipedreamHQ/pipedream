import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-delete-calendar-event",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Calendar Event",
  description: "Delete an event in the user's default calendar. [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-delete?view=graph-rest-1.0&tabs=http)",
  props: {
    microsoftOutlook,
    eventId: {
      propDefinition: [
        microsoftOutlook,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.microsoftOutlook.deleteCalendarEvent({
      $,
      eventId: this.eventId,
    });

    $.export("$summary", `Successfully deleted calendar event with ID ${this.eventId}`);

    return response;
  },
};
