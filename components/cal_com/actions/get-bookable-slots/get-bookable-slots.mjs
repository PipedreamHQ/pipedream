import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-bookable-slots",
  name: "Get Bookable Slots",
  description: "Retrieve available bookable slots between a datetime range. [See the documentation](https://cal.com/docs/api-reference/v2/slots/get-available-time-slots-for-an-event-type)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calCom,
    start: {
      type: "string",
      label: "Start",
      description: "Start date/time in ISO 8601 format (UTC), e.g. `2025-04-01T06:00:00Z`",
    },
    end: {
      type: "string",
      label: "End",
      description: "End date/time in ISO 8601 format (UTC), e.g. `2025-04-07T06:00:00Z`",
    },
    eventTypeId: {
      propDefinition: [
        calCom,
        "eventTypeId",
      ],
      description: "The ID of the event type to get slots for",
      optional: true,
    },
    eventTypeSlug: {
      type: "string",
      label: "Event Type Slug",
      description: "Slug of the event type. Requires `username` or `teamSlug`.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username of the individual event owner",
      optional: true,
    },
    usernames: {
      type: "string[]",
      label: "Usernames",
      description: "List of at least 2 usernames for a dynamic event (e.g. `alice` and `bob`). Sent to the API as a comma-separated string.",
      optional: true,
    },
    teamSlug: {
      type: "string",
      label: "Team Slug",
      description: "Slug of the team for team event type slot lookup.",
      optional: true,
    },
    organizationSlug: {
      type: "string",
      label: "Organization Slug",
      description: "Slug of the organization. Optional context for slug-based event type lookup.",
      optional: true,
    },
    timeZone: {
      propDefinition: [
        calCom,
        "timeZone",
      ],
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration (Minutes)",
      description: "Override the default slot duration in minutes",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "`range` returns objects with `start` and `end`; `time` returns start times only",
      optional: true,
      options: [
        {
          label: "Time (start times only)",
          value: "time",
        },
        {
          label: "Range (start and end)",
          value: "range",
        },
      ],
    },
    bookingUidToReschedule: {
      type: "string",
      label: "Booking UID to Reschedule",
      description: "UID of the booking being rescheduled. Excludes the original slot from busy calculations.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.calCom.getBookableSlots({
      params: {
        start: this.start,
        end: this.end,
        eventTypeId: this.eventTypeId,
        eventTypeSlug: this.eventTypeSlug,
        username: this.username,
        usernames: this.usernames?.join(","),
        teamSlug: this.teamSlug,
        organizationSlug: this.organizationSlug,
        timeZone: this.timeZone,
        duration: this.duration,
        format: this.format,
        bookingUidToReschedule: this.bookingUidToReschedule,
      },
      $,
    });
    const slotCount = response?.data
      ? Object.values(response.data).reduce(
        (sum, day) => sum + (Array.isArray(day)
          ? day.length
          : 0),
        0,
      )
      : 0;
    $.export("$summary", `Successfully retrieved ${slotCount} available slot(s)`);
    return response;
  },
};
