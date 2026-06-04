import app from "../../deel.app.mjs";

export default {
  key: "deel-create-shifts",
  name: "Create Shifts",
  description:
    "Create one or more time tracking shifts for a GP (Global Payroll) contract in Deel."
    + " Each shift records worked time with a date, duration, and associated shift rate."
    + " `shifts` must be a JSON array of shift objects. Each shift requires:"
    + " `description` (string), `external_id` (your unique ID), `shift_type` (`REGULAR`,"
    + " `CORRECTION_ABSOLUTE`, or `CORRECTION_DELTA`), `date_of_work` (ISO 8601 date),"
    + " `summary.time_unit` (`HOUR` or `DAY`), `summary.time_amount` (number),"
    + " `summary.shift_rate_external_id` (the external_id from **Create Shift Rate**)."
    + " Example: `[{\"description\": \"Regular work\", \"external_id\": \"shift-001\","
    + " \"shift_type\": \"REGULAR\", \"date_of_work\": \"2026-07-15\","
    + " \"summary\": {\"time_unit\": \"HOUR\", \"time_amount\": 8, \"shift_rate_external_id\": \"rate-overtime-001\"}}]`"
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/create-shifts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    shifts: {
      type: "string",
      label: "Shifts",
      description: "JSON array of shift objects. Each must include `description`, `external_id`, `shift_type` (`REGULAR`|`CORRECTION_ABSOLUTE`|`CORRECTION_DELTA`), `date_of_work`, and `summary` (with `time_unit`, `time_amount`, `shift_rate_external_id`). Example: `[{\"description\": \"Regular work\", \"external_id\": \"shift-001\", \"shift_type\": \"REGULAR\", \"date_of_work\": \"2026-07-15\", \"summary\": {\"time_unit\": \"HOUR\", \"time_amount\": 8, \"shift_rate_external_id\": \"rate-overtime-001\"}}]`",
    },
  },
  async run({ $ }) {
    const shiftsArray = JSON.parse(this.shifts);

    const response = await this.app._makeRequest({
      $,
      path: "/time_tracking/shifts",
      method: "POST",
      data: {
        data: {
          contract_id: this.contractId,
          shifts: shiftsArray,
        },
      },
    });

    $.export("$summary", `Created ${shiftsArray.length} shift(s) for contract ${this.contractId}`);
    return response;
  },
};
