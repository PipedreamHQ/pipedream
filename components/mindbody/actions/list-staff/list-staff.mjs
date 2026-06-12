import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-list-staff",
  name: "List Staff",
  description:
    "Returns staff members at the studio, including their IDs, names, bio, and role assignments (e.g., ClassTeacher, AppointmentInstructor)."
    + " Use this to discover `staffId` values needed by **Book Appointment** and **Get Classes**."
    + " Filter by `filters` to find staff with a specific role (e.g., `AppointmentInstructor`)."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/staff/get-staff)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filters: {
      type: "string",
      label: "Role Filters",
      description: "Comma-separated list of role filters to narrow results. Valid values: `ClassTeacher`, `AppointmentInstructor`, `Male`, `Female`. Example: `AppointmentInstructor`.",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
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
    if (this.filters) {
      params.Filters = this.filters.split(",").map((f) => f.trim())
        .filter(Boolean);
    }
    params.LocationId = this.locationId;
    const response = await this.app.listStaff({
      $,
      params,
    });
    const staff = response.StaffMembers || [];
    $.export("$summary", `Found ${staff.length} staff member${staff.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
