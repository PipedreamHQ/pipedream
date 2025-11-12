import docusign from "../../docusign_developer.app.mjs";
import common from "@pipedream/docusign/actions/common/common.mjs";

export default {
  ...common,
  key: "docusign_developer-create-signature-request",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Signature Request",
  description: "Creates a signature request from a template [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create)",
  type: "action",
  methods: {
    ...common.methods,
    _getStatusType() {
      return "sent";
    },
  },
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
      reloadProps: true,
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
  },
};
