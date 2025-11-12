import docusign from "../../docusign.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "docusign-new-change-in-envelope-status",
  version: "0.0.2",
  name: "New Change in Envelope Status",
  description: "Emit new event when an envelope's status is updated",
  type: "source",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    ...common.props,
  },
};
