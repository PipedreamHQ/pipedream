import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-delete-recurring-event-instance",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Recurring Event Instance",
  description: "Delete an individual instance of a recurring event in the user's default calendar. [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-delete?view=graph-rest-1.0&tabs=http)",
  props: {
    microsoftOutlook,
    recurringEventId: {
      propDefinition: [
        microsoftOutlook,
        "recurringEventId",
      ],
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "The start of the time range to find instances, in ISO 8601 format (e.g., `2024-01-01T00:00:00Z`)",
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "The end of the time range to find instances, in ISO 8601 format (e.g., `2024-12-31T23:59:59Z`)",
    },
    instanceId: {
      propDefinition: [
        microsoftOutlook,
        "instanceId",
        (c) => ({
          recurringEventId: c.recurringEventId,
          startDateTime: c.startDateTime,
          endDateTime: c.endDateTime,
        }),
      ],
    },
  },
  async run({ $ }) {
    if (new Date(this.startDateTime) >= new Date(this.endDateTime)) {
      throw new ConfigurationError("`Start Date Time` must be before `End Date Time`");
    }

    const response = await this.microsoftOutlook.deleteCalendarEvent({
      $,
      eventId: this.instanceId,
    });

    $.export("$summary", `Successfully deleted recurring event instance with ID ${this.instanceId}`);

    return response;
  },
};
