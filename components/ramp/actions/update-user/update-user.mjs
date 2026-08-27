// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-update-user",
  name: "Update User",
  description: "Update fields on an existing Ramp user (role, department, location, direct manager). Run the **List Users** action to find the user ID, **List Departments** and **List Locations** for related IDs. Example: to move a user into a department, pass their User ID plus a Department ID from **List Departments**; you can also set `role` (e.g. `BUSINESS_USER`), location, or direct manager. [See the documentation](https://docs.ramp.com/developer-api/v1/api/users#patch-developer-v1-users-user-id)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to update — a UUID, e.g. `bcc1e4ca-d38a-4cc9-98fc-e6c2066ad0ae`. Run the **List Users** action to find this value.",
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
      description: "New direct manager user ID — a UUID, e.g. `bcc1e4ca-d38a-4cc9-98fc-e6c2066ad0ae`. Run the **List Users** action to find valid IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      this.role === undefined &&
      this.departmentId === undefined &&
      this.locationId === undefined &&
      this.directManagerId === undefined
    ) {
      throw new ConfigurationError("Nothing to update: provide at least one of role, department, location, or direct manager.");
    }
    const response = await this.ramp.updateUser({
      $,
      userId: this.userId,
      data: {
        role: this.role,
        department_id: this.departmentId,
        location_id: this.locationId,
        direct_manager_id: this.directManagerId,
      },
    });
    $.export("$summary", `Successfully updated user ${this.userId}`);
    return response;
  },
};
