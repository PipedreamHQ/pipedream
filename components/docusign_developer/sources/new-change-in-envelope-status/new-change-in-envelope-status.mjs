import docusign from "../../docusign_developer.app.mjs";
import common from "@pipedream/docusign/sources/new-change-in-envelope-status/common.mjs";

export default {
  ...common,
  key: "docusign_developer-new-change-in-envelope-status",
  version: "0.0.3",
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
