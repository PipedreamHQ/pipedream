import talenthr from "../../talenthr.app.mjs";

export default {
  key: "talenthr-respond-time-off-request",
  name: "Respond to Time Off Request",
  description: "Responds to an employee's time off request. This action requires the request ID and the response status as props. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    talenthr,
    employeeId: {
      propDefinition: [
        talenthr,
        "employeeId",
      ],
    },
    timeOffRequestId: {
      propDefinition: [
        talenthr,
        "timeOffRequestId",
        ({ employeeId }) => ({
          employeeId,
        }),
      ],
    },
    accept: {
      type: "boolean",
      label: "Accept",
      description: "Approve 'true' or Reject 'false' the specified time off request. If the time off request has been answered or it has been cancelled then you cannot appove or reject it.",
    },
  },
  async run({ $ }) {
    const response = await this.talenthr.respondToTimeOffRequest({
      timeOffRequestId: this.timeOffRequestId,
      employeeId: this.employeeId,
      data: {
        accept: this.accept,
      },
    });

    $.export("$summary", `Successfully responded to time off request with ID ${this.timeOffRequestId}`);
    return response;
  },
};
