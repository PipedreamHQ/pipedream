import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-get-appointment-types",
  name: "Get Appointment Types",
  description: "Return a list ofappointment types. [See the documentation](https://developers.acuityscheduling.com/reference/appointment-types)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    acuityScheduling,
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Include deleted appointment types in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acuityScheduling.listAppointmentTypes({
      $,
      params: {
        includeDeleted: this.includeDeleted,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} appointment types`);
    return response;
  },
};
