import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ramp-update-user",
  name: "Update User",
  description: "Update fields on an existing Ramp user (role, department, location, direct manager). Run the **List Users** action to find the user ID, **List Departments** and **List Locations** for related IDs. Example: to move a user into a department, pass their User ID plus a Department ID from **List Departments**; you can also set `role` (e.g. `BUSINESS_USER`), location, or direct manager. [See the documentation](https://docs.ramp.com/developer-api/v1/api/users#patch-developer-v1-users-user-id).",
  version: "0.0.1",
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
      description: "The ID of the user to update. Run the **List Users** action to find this value.",
    },
    role: {
      type: "string",
      label: "Role",
      description: "New role for the user.",
      options: constants.ROLES,
      optional: true,
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "New department ID. Run the **List Departments** action to find valid IDs.",
      optional: true,
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "New location ID. Run the **List Locations** action to find valid IDs.",
      optional: true,
    },
    directManagerId: {
      type: "string",
      label: "Direct Manager ID",
      description: "New direct manager user ID. Run the **List Users** action to find valid IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
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
