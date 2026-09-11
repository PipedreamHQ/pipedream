import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-timesheet",
  name: "Get Timesheet",
  description: "Get a single timesheet by ID (GET /time-tracking/timesheets/{id}). Returns derived status (OPEN, PENDING_APPROVAL, APPROVED) and type. Use **List Timesheets** to find IDs. [See the documentation](https://documentation.bamboohr.com/reference/get-timesheet)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    bamboohr,
    timesheetId: {
      propDefinition: [
        bamboohr,
        "timesheetId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getTimesheet({
      $,
      timesheetId: this.timesheetId,
    });
    $.export("$summary", `Retrieved timesheet ${this.timesheetId}`);
    return response;
  },
};
