import ramp from "../../ramp_sandbox.app.mjs";
import createUserInvite from "../../../ramp/actions/create-user-invite/create-user-invite.mjs";

export default {
  ...createUserInvite,
  key: "ramp_sandbox-create-user-invite",
  name: "Create User Invite",
  description: "Sends out an invite for a new user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/users#post-developer-v1-users-deferred)",
  version: "0.0.3",
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
