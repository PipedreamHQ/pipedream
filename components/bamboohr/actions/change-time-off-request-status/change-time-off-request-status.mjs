import bamboohr from "../../bamboohr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bamboohr-change-time-off-request-status",
  name: "Change Time Off Request Status",
  description: "Change the status of a time off request, including cancellation (PUT /time_off/requests/{requestId}/status). Setting status to `canceled` cancels the request; this same endpoint covers both status changes and cancellation. Use **List Time Off Requests** to find request IDs. [See the documentation](https://documentation.bamboohr.com/reference/update-time-off-request-status)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    requestId: {
      propDefinition: [
        bamboohr,
        "requestId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "New status. One of `approved`, `denied`, `declined`, `canceled`.",
      options: constants.TIME_OFF_REQUEST_STATUSES,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note explaining the status change.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.updateTimeOffRequestStatus({
      $,
      requestId: this.requestId,
      data: {
        status: this.status,
        note: this.note,
      },
    });
    $.export("$summary", `Updated status of request ${this.requestId} to "${this.status}"`);
    return response;
  },
};
