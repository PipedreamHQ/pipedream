import docusign from "../../docusign_developer.app.mjs";
import common from "../../../docusign/sources/envelope-sent-or-complete/common.mjs";

export default {
  ...common,
  key: "docusign_developer-envelope-sent-or-complete",
  version: "0.0.1",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    ...common.props,
  }
};
