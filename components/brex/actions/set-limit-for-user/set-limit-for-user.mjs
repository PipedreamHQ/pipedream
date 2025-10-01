import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "Set Limit for User",
  description: "Sets the monthly limit for a user. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/setUserLimit).",
  key: "brex-set-limit-for-user",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    brexApp,
    user: {
      propDefinition: [
        brexApp,
        "user",
      ],
      label: "User",
      description: "User to set the new limit",
      withLabel: true,
      optional: false,
    },
    ...common.props,
  },
};
