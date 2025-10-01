import app from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-bookable-slots",
  name: "Get Bookable Slots",
  description: "Retrieves all bookable slots between a datetime range. [See the documentation](https://cal.com/docs/api-reference/v1/slots/get-all-bookable-slots-between-a-datetime-range#get-all-bookable-slots-between-a-datetime-range)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    eventTypeId: {
      propDefinition: [
        app,
        "eventTypeId",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start time of the slot lookup (ISO 8601 format), e.g. `2025-04-01T06:00:00Z`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End time of the slot lookup (ISO 8601 format), e.g. `2025-04-01T06:00:00Z`",
    },
    timeZone: {
      propDefinition: [
        app,
        "timeZone",
      ],
      optional: true,
    },
    isTeamEvent: {
      type: "boolean",
      label: "Is Team Event",
      description: "True if the event is a team event",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ...params
    } = this;

    const response = await app.getBookableSlots({
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved bookable slots");
    return response;
  },
};
