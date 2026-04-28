import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-get-event",
  name: "Get Event",
  description: "Retrieve a calendar event by its Microsoft Graph event ID. Pass the `id` from **List Events** when you need full details (for example `body`, `attendees`, or `recurrence`) that list responses may omit or truncate. [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    eventId: {
      propDefinition: [
        microsoftOutlook,
        "eventId",
      ],
      description: "The Microsoft Graph event ID — the `id` field on each object returned by **List Events** (including occurrences from calendar view when **Include Recurring** is enabled).",
    },
    select: {
      type: "string",
      label: "Properties to return ($select)",
      description: "Optional. Comma-separated Microsoft Graph [event](https://learn.microsoft.com/en-us/graph/api/resources/event) property names (for example `subject,body,bodyPreview,start,end,attendees,organizer,location`). When empty, the API returns its default property set.",
      optional: true,
    },
  },
  async run({ $ }) {
    const normalizedSelect = this.select?.trim()
      ? this.select.split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .join(",")
      : "";

    const params = normalizedSelect
      ? {
        $select: normalizedSelect,
      }
      : {};

    const event = await this.microsoftOutlook.getCalendarEvent({
      $,
      eventId: this.eventId,
      params,
    });

    const label = event?.subject ?? this.eventId;
    $.export("$summary", `Successfully retrieved event "${label}"`);
    return event;
  },
};
