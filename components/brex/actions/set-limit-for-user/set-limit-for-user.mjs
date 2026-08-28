// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "Set Limit for User",
  description: "Sets a user's recurring monthly spend limit, replacing any limit already in place. This governs corporate cards (`Limit Type` = `USER`); vendor cards carry their own limit set on the card itself. Use **List Users** to find the user ID and **Get User Limit** to read the current limit. [See the documentation](https://developer.brex.com/openapi/team_api/users/setuserlimit)",
  key: "brex-set-limit-for-user",
  version: "0.1.3",
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
      description: "The person whose monthly limit is being set, as a Brex user ID, e.g. `cuuser_ckze72soa117f01pkmf1wcpl3`. Use **List Users** to find a user ID by email address.",
      withLabel: true,
      optional: false,
    },
    ...common.props,
  },
};
