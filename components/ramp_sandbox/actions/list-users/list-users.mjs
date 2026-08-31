// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listUsers from "@pipedream/ramp/actions/list-users/list-users.mjs";
import constants from "@pipedream/ramp/common/constants.mjs";

export default {
  ...listUsers,
  key: "ramp_sandbox-list-users",
  name: "List Users",
  description: "Retrieve a paginated list of Ramp Sandbox users, optionally filtered by department, location, email, role, or status. Returns a compact summary of each user by default (id, first_name, last_name, email, role, status, department_id, location_id, manager_id, is_manager); use **Get User** for the full record, or pass `fields` to include specific extra fields. Use this to discover valid user IDs for **Get User** and **Update User**. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more users exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/users#get-developer-v1-users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ramp,
    departmentId: {
      propDefinition: [
        ramp,
        "departmentId",
      ],
      description: "Filter by department ID — a Ramp UUID, e.g. `fffe6c22-698f-4dc5-b2b1-b35f86947d90`. Run the **List Departments** action to find valid IDs.",
    },
    locationId: {
      propDefinition: [
        ramp,
        "locationId",
      ],
      description: "Filter by location ID — a Ramp UUID, e.g. `961c6f01-5719-4f4c-8fef-4096a031f32a`. Run the **List Locations** action to find valid IDs.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by user email address.",
      optional: true,
    },
    role: {
      propDefinition: [
        ramp,
        "role",
      ],
      description: "Filter by user role.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by user status (e.g. `USER_ACTIVE`).",
      options: constants.USER_STATUSES,
      optional: true,
    },
    pageSize: {
      propDefinition: [
        ramp,
        "pageSize",
      ],
    },
    start: {
      propDefinition: [
        ramp,
        "start",
      ],
    },
    fields: {
      propDefinition: [
        ramp,
        "fields",
      ],
      description: "Optional list of user fields to include per record in addition to the compact default (e.g. `custom_fields`, `phone`, `business_id`). Leave empty for the compact summary; use **Get User** for the complete record.",
    },
  },
};
