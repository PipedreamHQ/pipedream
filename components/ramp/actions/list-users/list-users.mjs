import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ramp-list-users",
  name: "List Users",
  description: "Retrieve a paginated list of Ramp users, optionally filtered by department, location, email, role, or status. Returns a compact summary of each user by default (id, name, email, role, status, department, location); use **Get User** for the full record, or pass `fields` to include specific extra fields. Use this to discover valid user IDs for **Get User** and **Update User**. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more users exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/users#get-developer-v1-users).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Filter by department ID. Run the **List Departments** action to find valid IDs.",
      optional: true,
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Filter by location ID. Run the **List Locations** action to find valid IDs.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by user email address.",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "Filter by user role.",
      options: constants.ROLES,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by user status.",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page, between 2 and 100 (default 20).",
      min: 2,
      max: 100,
      optional: true,
    },
    start: {
      type: "string",
      label: "Start (Pagination Cursor)",
      description: "Pagination cursor for the next page. Take the `start` query-parameter value from the previous response's `page.next` URL and pass it here.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of user fields to include per record in addition to the compact default (e.g. `custom_fields`, `phone`, `business_id`). Leave empty for the compact summary; use **Get User** for the complete record.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.listUsers({
      $,
      params: {
        department_id: this.departmentId,
        location_id: this.locationId,
        email: this.email,
        role: this.role,
        status: this.status,
        page_size: this.pageSize,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} user(s)`);
    return utils.projectList(response, utils.USER_COMPACT_FIELDS, this.fields);
  },
};
