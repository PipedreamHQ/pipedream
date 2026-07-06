import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-accept-event",
  name: "Accept Event",
  description:
    "Accept a calendar event invitation and optionally send a response to the organizer."
    + " Use **List Events** or **Get Event** to find the event ID."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-accept?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftOutlook,
    eventId: {
      propDefinition: [
        microsoftOutlook,
        "eventId",
      ],
    },
    comment: {
      propDefinition: [
        microsoftOutlook,
        "comment",
      ],
    },
    sendResponse: {
      propDefinition: [
        microsoftOutlook,
        "sendResponse",
      ],
    },
  },
  async run({ $ }) {
    const event = await this.microsoftOutlook.getCalendarEvent({
      eventId: this.eventId,
    });

    const data = {
      comment: this.comment,
      sendResponse: this.sendResponse ?? true,
    };

    await this.microsoftOutlook.acceptCalendarEvent({
      eventId: this.eventId,
      data,
    });

    const subject = event?.subject ?? this.eventId;
    $.export("$summary", `Accepted event "${subject}"`);
    return {
      success: true,
      eventId: this.eventId,
      subject,
    };
  },
};
