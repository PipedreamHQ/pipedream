import app from "../../jibble.app.mjs";

export default {
  name: "Create Timesheets Daily Summary",
  description: "Gets daily timsheets summary for given date range and given persons. May omit personIds parameters in query so it will return data for all member of the organization.  [See the documentation](https://docs.api.jibble.io/#5510bcd1-3c58-4ffb-9048-a962edf9133a).",
  key: "jibble-create-timesheets-daily-summary",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the timesheet. Must use `YYYY-MM-DD` format.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the timesheet. Must use `YYYY-MM-DD` format.",
    },
    personIds: {
      propDefinition: [
        app,
        "personId",
      ],
      type: "string[]",
      description: "The ID of the persons to create the timesheet.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      date: this.startDate,
      endDate: this.endDate,
      personIds: this.personIds,
    };
    const res = await this.app.createTimesheetsDailySummary(data, $);
    $.export("summary", "Timesheet successfully created.");
    return res;
  },
};
