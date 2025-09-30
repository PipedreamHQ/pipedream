import common from "./common.mjs";
import brexApp from "../../brex.app.mjs";

export default {
  ...common,
  name: "Create Card",
  description: "Creates a new card. [See the docs here](https://developer.brex.com/openapi/team_api/#operation/createCard).",
  key: "brex-create-card",
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
      description: "The owner of the card",
      withLabel: true,
      optional: false,
    },
    ...common.props,
  },
};
