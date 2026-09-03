// x-pd-ai: optimized
import common from "./common.mjs";
import brexApp from "../../brex.app.mjs";

export default {
  ...common,
  name: "Create Card",
  description: "Issues a new virtual card to a Brex user. Physical cards are not supported — Brex requires a mailing address to ship one and this action does not collect it. A vendor card (`Limit Type` = `CARD`) carries its own spend limit set here; a corporate card (`Limit Type` = `USER`) draws on the cardholder's monthly limit instead, which **Set Limit for User** controls. Use **List Users** to find the cardholder. The returned card ID is what **Get Card**, **Freeze Card**, **Cancel Card**, and **Update Card Limit** take. [See the documentation](https://developer.brex.com/openapi/team_api/cards/createcard)",
  key: "brex-create-card",
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
      description: "The person the card is issued to, as a Brex user ID, e.g. `cuuser_ckze72soa117f01pkmf1wcpl3`. Use **List Users** to find a user ID by email address.",
      withLabel: true,
      optional: false,
    },
    ...common.props,
  },
};
