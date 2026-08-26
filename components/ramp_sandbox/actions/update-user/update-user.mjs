// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import updateUser from "@pipedream/ramp/actions/update-user/update-user.mjs";

export default {
  ...updateUser,
  key: "ramp_sandbox-update-user",
  name: "Update User",
  description: "Update fields on an existing Ramp Sandbox user (role, department, location, direct manager). Run the **List Users** action to find the user ID, **List Departments** and **List Locations** for related IDs. Example: to move a user into a department, pass their User ID plus a Department ID from **List Departments**; you can also set `role` (e.g. `BUSINESS_USER`), location, or direct manager. [See the documentation](https://docs.ramp.com/developer-api/v1/api/users#patch-developer-v1-users-user-id).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ramp,
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to update. Run the **List Users** action to find this value.",
    },
    role: {
      propDefinition: [
        ramp,
        "role",
      ],
      description: "New role for the user.",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        ramp,
        "departmentId",
      ],
      description: "New department ID — a UUID, e.g. `fffe6c22-698f-4dc5-b2b1-b35f86947d90`. Run the **List Departments** action to find valid IDs.",
    },
    locationId: {
      propDefinition: [
        ramp,
        "locationId",
      ],
      description: "New location ID — a UUID, e.g. `961c6f01-5719-4f4c-8fef-4096a031f32a`. Run the **List Locations** action to find valid IDs.",
    },
    directManagerId: {
      type: "string",
      label: "Direct Manager ID",
      description: "New direct manager user ID. Run the **List Users** action to find valid IDs.",
      optional: true,
    },
  },
};
