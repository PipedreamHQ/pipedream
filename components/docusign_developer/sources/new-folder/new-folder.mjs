import docusign from "../../docusign_developer.app.mjs";
import common from "../../../docusign/sources/new-folder/common.mjs";

export default {
  ...common,
  key: "docusign_developer-new-folder",
  version: "0.0.1",
  name: "New Folder",
  description: "Emit new event when a new folder is created",
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
