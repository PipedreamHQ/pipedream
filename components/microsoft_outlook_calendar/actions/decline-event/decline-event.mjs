import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-decline-event",
  name: "Decline Event",
  description:
    "Decline a calendar event invitation and optionally propose an alternate time."
    + " Use **List Events** or **Get Event** to find the event ID."
    + " To propose a new time, pass `proposedNewTime` as a JSON string with `start` and `end` objects (each with `dateTime` in ISO 8601 format and `timeZone` as a Windows timezone name, e.g. `\"Pacific Standard Time\"`). Alternate-time proposals are only valid when the event has `allowNewTimeProposals: true` and `sendResponse` is `true`."
    + " [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-decline?view=graph-rest-1.0&tabs=http)",
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
    proposedNewTime: {
      type: "string",
      label: "Proposed New Time",
      description: "Optional alternate time to propose. JSON string with `start` and `end` objects, each having `dateTime` (ISO 8601) and `timeZone` (Windows timezone name). Example: `{\"start\":{\"dateTime\":\"2024-03-15T14:00:00\",\"timeZone\":\"Pacific Standard Time\"},\"end\":{\"dateTime\":\"2024-03-15T15:00:00\",\"timeZone\":\"Pacific Standard Time\"}}`. Only valid when the event allows new time proposals and `sendResponse` is `true`.",
      optional: true,
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

    if (this.proposedNewTime) {
      try {
        data.proposedNewTime = JSON.parse(this.proposedNewTime);
      } catch (err) {
        throw new ConfigurationError(`Invalid JSON for proposedNewTime: ${err.message}`);
      }
    }

    await this.microsoftOutlook.declineCalendarEvent({
      eventId: this.eventId,
      data,
    });

    const subject = event?.subject ?? this.eventId;
    $.export("$summary", `Declined event "${subject}"`);
    return {
      success: true,
      eventId: this.eventId,
      subject,
    };
  },
};
