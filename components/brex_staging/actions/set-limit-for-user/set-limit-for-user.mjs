import brexApp from "../../brex_staging.app.mjs";
import common from "@pipedream/brex/actions/set-limit-for-user/common.mjs";

export default {
  ...common,
  name: "Set Limit for User",
  description: "Sets the monthly limit for a user. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/setUserLimit).",
  key: "brex_staging-set-limit-for-user",
  version: "0.0.3",
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
