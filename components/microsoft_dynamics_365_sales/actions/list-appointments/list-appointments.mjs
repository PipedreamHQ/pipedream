import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-list-appointments",
  name: "List Appointments",
  description: "List appointments (full entity per row, ordered by scheduled start descending). [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/appointment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoft,
    filter: {
      type: "string",
      label: "Filter",
      description: "Optional OData `$filter` (for example `statecode eq 0` or a `scheduledstart` range). [Filter reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query/filter-rows)",
      optional: true,
    },
    recordsPerPage: {
      type: "integer",
      label: "Records Per Page",
      description: "Number of appointments to return (default 25, max 100)",
      optional: true,
      default: 25,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const data = await this.microsoft.listAppointments({
      $,
      filter: this.filter,
      top: this.recordsPerPage ?? 25,
    });

    const count = data?.value?.length ?? 0;
    $.export("$summary", `Retrieved ${count} appointment${count === 1
      ? ""
      : "s"}`);

    return data;
  },
};
