import app from "../../signnow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "signnow-send-field-invite",
  name: "Send Field Invite",
  description: "Creates and sends a field invite to sign a document. [See the documentation](https://docs.signnow.com/docs/signnow/field-invite/operations/create-a-document-invite)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Email addresses and settings for all recipients. Each row should be represented as a JSON object with the following required properties as an example: `{\"email\": \"test1@example.com\", \"role\": \"Recipient 1\"}`",
    },
    from: {
      type: "string",
      label: "From",
      description: "Sender's email address: you can use only the email address associated with your signNow account (login email) as `from` address",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "Email addresses for CC recipients",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject for all signers.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Email message for all signers.",
      optional: true,
    },
  },
  methods: {
    sendFieldInvite({
      documentId, ...args
    } = {}) {
      return this.app.post({
        path: `/document/${documentId}/invite`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendFieldInvite,
      documentId,
      to,
      from,
      cc,
      subject,
      message,
    } = this;

    const response = await sendFieldInvite({
      $,
      documentId,
      data: {
        to: utils.parseArray(to),
        from,
        cc: utils.parseArray(cc),
        subject,
        message,
      },
    });

    $.export("$summary", "Successfully sent field invite to sign the document.");
    return response;
  },
};
