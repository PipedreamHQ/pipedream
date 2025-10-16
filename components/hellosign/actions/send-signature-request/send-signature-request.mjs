import hellosign from "../../hellosign.app.mjs";

export default {
  key: "hellosign-send-signature-request",
  name: "Send Signature Request",
  description: "Send a signature request with Dropbox Sign. [See the documentation](https://developers.hellosign.com/api/reference/operation/signatureRequestSend/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hellosign,
    fileUrls: {
      propDefinition: [
        hellosign,
        "fileUrls",
      ],
    },
    signers: {
      propDefinition: [
        hellosign,
        "signers",
      ],
    },
    ccEmailAddresses: {
      propDefinition: [
        hellosign,
        "ccEmailAddresses",
      ],
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
        name,
        email_address: email,
      });
    }

    const response = await this.hellosign.sendSignatureRequest({
      data: {
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
