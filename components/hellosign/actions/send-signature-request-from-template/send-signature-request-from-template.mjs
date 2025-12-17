import hellosign from "../../hellosign.app.mjs";

export default {
  key: "hellosign-send-signature-request-from-template",
  name: "Send Signature Request From Template",
  description: "Send a signature request from a template with Dropbox Sign. [See the documentation](https://developers.hellosign.com/api/reference/operation/signatureRequestSendWithTemplate/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hellosign,
    templateId: {
      propDefinition: [
        hellosign,
        "templateId",
      ],
    },
    signers: {
      propDefinition: [
        hellosign,
        "signers",
      ],
    },
    role: {
      propDefinition: [
        hellosign,
        "role",
        (c) => ({
          templateId: c.templateId,
        }),
      ],
    },
    fileUrls: {
      propDefinition: [
        hellosign,
        "fileUrls",
      ],
      optional: true,
    },
    allowDecline: {
      propDefinition: [
        hellosign,
        "allowDecline",
      ],
    },
    message: {
      propDefinition: [
        hellosign,
        "message",
      ],
    },
    subject: {
      propDefinition: [
        hellosign,
        "subject",
      ],
    },
    title: {
      propDefinition: [
        hellosign,
        "title",
      ],
    },
    testMode: {
      propDefinition: [
        hellosign,
        "testMode",
      ],
    },
  },
  async run({ $ }) {
    const signers = [];
    for (const [
      name,
      email,
    ] of Object.entries(this.signers)) {
      signers.push({
        role: this.role,
        name,
        email_address: email,
      });
    }

    const response = await this.hellosign.sendSignatureRequestWithTemplate({
      data: {
        template_ids: [
          this.templateId,
        ],
        file_urls: this.fileUrls,
        signers,
        cc_email_addresses: this.ccEmailAddresses,
        allow_decline: this.allowDecline,
        message: this.message,
        subject: this.subject,
        title: this.title,
        test_mode: this.testMode,
      },
    });

    if (response) {
      $.export("$summary", "Successfully sent signature request");
    }

    return response;
  },
};
