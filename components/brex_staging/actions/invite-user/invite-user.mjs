import brexApp from "../../brex_staging.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Invite User",
  description: "Invites a new user as an employee. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/createUser).",
  key: "brex-invite-user",
  version: "0.0.30",
  type: "action",
  props: {
    brexApp,
    firstName: {
      type: "string",
      label: "First Name",
      description: "User first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "User last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "User email",
    },
    manager: {
      propDefinition: [
        brexApp,
        "user",
      ],
      label: "Manager",
      description: "Managers can review and approve expenses for their direct reports",
    },
    department: {
      propDefinition: [
        brexApp,
        "department",
      ],
    },
    location: {
      propDefinition: [
        brexApp,
        "location",
      ],
    },
  },
  async run ({ $ }) {
    const {
      firstName,
      lastName,
      email,
      manager,
      department,
      location,
    } = this;

    const res = await axios($, this.brexApp._getAxiosParams({
      method: "POST",
      path: "/users",
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        manager_id: manager,
        department_id: department,
        location_id: location,
      },
    }));

    $.export("$summary", `${firstName} ${lastName} <${email}> successfully invited.`);
    return res;
  },
};
