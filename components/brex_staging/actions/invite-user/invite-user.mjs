import brexApp from "../../brex_staging.app.mjs";
import common from "@pipedream/brex/actions/invite-user/common.mjs";

export default {
  ...common,
  name: "Invite User",
  description: "Invites a new user as an employee. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/createUser).",
  key: "brex_staging-invite-user",
  version: "0.0.3",
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
};
