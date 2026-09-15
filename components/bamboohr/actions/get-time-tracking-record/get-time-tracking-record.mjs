import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-time-tracking-record",
  name: "Get Time Tracking Record",
  description: "Get a legacy Hours API time-tracking record by ID (GET /timetracking/record/{id}). Returns hours, date, employee, project, task, and shift differential. Note: missing records may return an empty/null payload rather than 404. [See the documentation](https://documentation.bamboohr.com/reference/get-time-tracking-record)",
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
    recordId: {
      propDefinition: [
        bamboohr,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getTimeTrackingRecord({
      $,
      recordId: this.recordId,
    });
    const isEmpty = !response || (typeof response === "object" && Object.keys(response).length === 0);
    $.export("$summary", isEmpty
      ? `No time tracking record found for ID ${this.recordId}`
      : `Retrieved time tracking record ${this.recordId}`);
    return response;
  },
};
