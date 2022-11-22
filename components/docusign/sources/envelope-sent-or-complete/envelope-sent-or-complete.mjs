import docusign from "../../docusign.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "docusign-envelope-sent-or-complete",
  version: "0.0.4",
  name: "Envelope Sent or Complete",
  description:
    "Emit new event when an envelope status is set to sent or complete",
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
