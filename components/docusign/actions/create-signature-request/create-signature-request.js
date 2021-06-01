const docusign = require("../../docusign.app.js");

module.exports = {
  key: "docusign-create-signature-request",
  name: "Create Signature Request",
  description: "Creates a signature request from a template",
  version: "0.0.56",
  type: "action",
  props: {
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
  },
  async run() {
    const baseUri = await this.docusign.getBaseUri(this.account);
    const data = {
      status: "sent",
      templateId: this.template,
      templateRoles: [
        {
          roleName: this.role,
          name: this.recipientName,
          email: this.recipientEmail,
        },
      ],
      emailSubject: this.emailSubject,
    };
    if (this.emailBlurb) data.emailBlurb = this.emailBlurb;
    return await this.docusign.createEnvelope(baseUri, this.account, data);
  },
};
