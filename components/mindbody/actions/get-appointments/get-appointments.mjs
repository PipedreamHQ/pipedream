import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-get-appointments",
  name: "Get Appointments",
  description:
    "Returns staff appointments, optionally filtered by date range, client, or staff member."
    + " Use `clientId` to show all appointments for a specific client — first use **Search Clients** to find their ID."
    + " Use `staffId` to filter by instructor."
    + " Date formats: `YYYY-MM-DD` (e.g., `2026-07-01`)."
    + " Without date filters, returns appointments from the current date forward (up to `limit`)."
    + " [See the documentation](https://developers.mindbodyonline.com/PublicDocumentation/V6#tag/Appointment/operation/AppointmentService_GetStaffAppointments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
      description: "Filter appointments for a specific client. Use **Search Clients** to find the client ID.",
      optional: true,
    },
    staffId: {
      type: "string",
      label: "Staff ID",
      description: "Filter appointments for a specific staff member. Use **List Staff** to find staff IDs.",
      optional: true,
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      Limit: this.limit,
      Offset: this.offset,
    };
    if (this.clientId) params.ClientIds = [
      this.clientId,
    ];
    if (this.staffId) params.StaffIds = [
      this.staffId,
    ];
    params.StartDate = this.startDate;
    params.EndDate = this.endDate;

    const response = await this.app.getStaffAppointments({
      $,
      params,
    });
    const appointments = response.Appointments || [];
    $.export("$summary", `Found ${appointments.length} appointment${appointments.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
