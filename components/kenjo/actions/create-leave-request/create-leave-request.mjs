import kenjo from "../../kenjo.app.mjs";

export default {
  key: "kenjo-create-leave-request",
  name: "Create Leave Request",
  description: "Creates a new leave request in Kenjo. [See the documentation](https://kenjo.readme.io/reference/post_time-off-requests).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kenjo,
    employeeId: {
      propDefinition: [
        kenjo,
        "employeeId",
      ],
    },
    timeOffTypeId: {
      propDefinition: [
        kenjo,
        "timeOffTypeId",
      ],
    },
    from: {
      type: "string",
      label: "From",
      description: "The starting date of the time-off request in format `YYYY-MM-DD`",
    },
    to: {
      type: "string",
      label: "To",
      description: "The ending date of the time-off request in format `YYYY-MM-DD`",
    },
    partOfDayFrom: {
      type: "string",
      label: "Part of Day From",
      description: "The duration of the from date. 'StartOfDay' means that the from date is the entire day. 'HalfOfDay' means that the request starts to apply in the middle of the from day. If not specified, the default value will be 'StartOfDay'.",
      options: [
        "StartOfDay",
        "HalfOfDay",
      ],
      optional: true,
    },
    partOfDayTo: {
      type: "string",
      label: "Part of Day To",
      description: "The duration of the to date. 'EndOfDay' means that the to date is the entire day. 'HalfOfDay' means the request starts to apply in the middle of the to day. If not specified, the default value will be 'EndOfDay'.",
      options: [
        "HalfOfDay",
        "EndOfDay",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the time-off request",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kenjo.createLeaveRequest({
      $,
      data: {
        _userId: this.employeeId,
        _timeOffTypeId: this.timeOffTypeId,
        from: this.from,
        to: this.to,
        partOfDayFrom: this.partOfDayFrom,
        partOfDayTo: this.partOfDayTo,
        description: this.description,
      },
    });
    $.export("$summary", `Successfully created leave request with ID: ${response._id}`);
    return response;
  },
};
