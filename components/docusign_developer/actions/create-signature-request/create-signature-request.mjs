import docusign from "../../docusign_developer.app.mjs";
import common from "../../../docusign/actions/create-signature-request/common.mjs";

export default {
  ...common,
  key: "docusign_developer-create-signature-request",
//  version: "0.0.1",
  version: "0.0.2",
  props: {
    ...common.props,
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    template: {
      propDefinition: [
        docusign,
        "template",
        (c) => ({
          account: c.account,
        }),
      ],
    },
    emailSubject: {
      propDefinition: [
        docusign,
        "emailSubject",
      ],
    },
    emailBlurb: {
      propDefinition: [
        docusign,
        "emailBlurb",
      ],
    },
    recipientEmail: {
      propDefinition: [
        docusign,
        "recipientEmail",
      ],
    },
    recipientName: {
      propDefinition: [
        docusign,
        "recipientName",
      ],
    },
    role: {
      propDefinition: [
        docusign,
        "role",
        (c) => ({
          account: c.account,
          template: c.template,
        }),
      ],
    },
  }
};
