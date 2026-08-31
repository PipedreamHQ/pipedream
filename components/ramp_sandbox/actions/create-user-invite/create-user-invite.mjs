// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import createUserInvite from "@pipedream/ramp/actions/create-user-invite/create-user-invite.mjs";

export default {
  ...createUserInvite,
  key: "ramp_sandbox-create-user-invite",
  name: "Create User Invite",
  description: "Invite a new person to your Ramp Sandbox organization by email — use this to onboard an employee who doesn't yet have a Ramp Sandbox account. Requires their email, first and last name, and `role` (e.g. `BUSINESS_USER`); department, location, and direct manager are optional. Run **List Departments** and **List Locations** to find valid department/location IDs, and **List Users** to find a direct manager's user ID — each is a Ramp UUID, e.g. `fffe6c22-698f-4dc5-b2b1-b35f86947d90`. This is a deferred operation, so the invited user may not appear in **List Users** immediately; once they do, use **Update User** to change their role, department, location, or manager. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/users#post-developer-v1-users-deferred)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
};
