import docusign from "../../docusign.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "docusign-create-signature-request",
  version: "0.0.2",
  name: "Create Signature Request",
  description: "Creates a signature request from a template [See the docs here](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create)",
  type: "action",
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
  },
};
