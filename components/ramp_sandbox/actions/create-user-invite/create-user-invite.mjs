import ramp from "../../ramp_sandbox.app.mjs";

export default {
  key: "ramp_sandbox-create-user-invite",
  name: "Create User Invite",
  description: "Sends out an invite for a new user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/users#post-developer-v1-users-deferred)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ramp,
    email: {
      type: "string",
      label: "Email",
      description: "The employee's email address",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the employee",
    },
    role: {
      propDefinition: [
        ramp,
        "role",
      ],
    },
    departmentId: {
      propDefinition: [
        ramp,
        "departmentId",
      ],
    },
    directManagerId: {
      propDefinition: [
        ramp,
        "userId",
      ],
      label: "Direct Manager ID",
      description: "Unique identifier of the employee's direct manager",
      optional: true,
    },
    locationId: {
      propDefinition: [
        ramp,
        "locationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ramp.createUserInvite({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        role: this.role,
        department_id: this.departmentId,
        direct_manager_id: this.directManagerId,
        location_id: this.locationId,
      },
    });
    $.export("$summary", `Invite sent successfully to new user ${this.firstName} ${this.lastName}`);
    return response;
  },
};
