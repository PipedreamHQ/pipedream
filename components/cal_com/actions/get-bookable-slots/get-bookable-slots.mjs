import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-bookable-slots",
  name: "Get Bookable Slots",
  description: "Retrieve available bookable slots between a datetime range. [See the documentation](https://cal.com/docs/api-reference/v2/slots/get-available-slots)",
  version: "0.0.5",
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
        "time",
        "range",
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
    const params = {
      start: this.start,
      end: this.end,
    };
    if (this.eventTypeId) params.eventTypeId = this.eventTypeId;
    if (this.eventTypeSlug) params.eventTypeSlug = this.eventTypeSlug;
    if (this.username) params.username = this.username;
    if (this.timeZone) params.timeZone = this.timeZone;
    if (this.duration) params.duration = this.duration;
    if (this.format) params.format = this.format;
    if (this.bookingUidToReschedule) params.bookingUidToReschedule = this.bookingUidToReschedule;

    const response = await this.calCom.getBookableSlots({
      params,
      $,
    });
    $.export("$summary", "Successfully retrieved available slots");
    return response;
  },
};
