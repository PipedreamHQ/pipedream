import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-list-appointment-categories",
  name: "List Appointment Categories",
  description: "List Category of Appointment options for the custom attribute used by create/update appointment actions (loaded from metadata or distinct values on existing rows). [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-metadata-web-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoft,
  },
  async run({ $ }) {
    const data = await this.microsoft.fetchAppointmentCategories({
      $,
    });

    const count = Array.isArray(data.categories)
      ? data.categories.length
      : 0;
    $.export("$summary", `Found ${count} categor${count === 1
      ? "y"
      : "ies"}`);

    return data;
  },
};
