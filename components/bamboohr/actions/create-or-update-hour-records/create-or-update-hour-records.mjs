import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-create-or-update-hour-records",
  name: "Create or Update Hour Records",
  description: "Bulk add or edit approved hour records in the legacy Hours API (POST /timetracking/record). Records whose ID already exists are updated; unrecognized IDs are created. The API can return HTTP 201 even when individual items fail validation — check each item's `success` flag in the response. Use **Create Hour Record** for a single record. [See the documentation](https://documentation.bamboohr.com/reference/create-or-update-time-tracking-hour-records)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    hourRecords: {
      type: "string",
      label: "Hour Records",
      description: "Array of hour record objects as a JSON string. Each item requires `timeTrackingId`, `employeeId`, `dateHoursWorked` (YYYY-MM-DD), `hoursWorked`, and `rateType` (`REG`, `OT`, or `DT`); optional fields: `divisionId`, `departmentId`, `jobTitleId`, `payCode`, `payRate`, `jobCode`, `jobData`. E.g. `[{\"timeTrackingId\":\"a1b2c3\",\"employeeId\":123,\"dateHoursWorked\":\"2026-09-01\",\"hoursWorked\":8,\"rateType\":\"REG\"}]`",
    },
  },
  async run({ $ }) {
    const hourRecords = typeof this.hourRecords === "string"
      ? JSON.parse(this.hourRecords)
      : this.hourRecords;

    const response = await this.bamboohr.createOrUpdateHourRecords({
      $,
      data: hourRecords,
    });
    $.export("$summary", `Submitted ${hourRecords.length} hour record(s)`);
    return response;
  },
};
