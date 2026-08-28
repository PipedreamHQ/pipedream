// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "Invite User",
  description: "Invites a person to the Brex account as an employee, emailing them to finish onboarding. Returns the new Brex user ID, which **Create Card**, **Set Limit for User**, and **Get User** take. [See the documentation](https://developer.brex.com/openapi/team_api/users/createuser)",
  key: "brex-invite-user",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    brexApp,
    ...common.props,
    manager: {
      propDefinition: [
        brexApp,
        "user",
      ],
      label: "Manager",
      description: "The person who reviews and approves this user's expenses, as a Brex user ID. Use **List Users** to find a user ID by email address.",
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
};
