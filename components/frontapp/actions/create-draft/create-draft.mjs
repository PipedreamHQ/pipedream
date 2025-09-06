import frontApp from "../../frontapp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "frontapp-create-draft",
  name: "Create Draft",
  description: "Create a draft message which is the first message of a new conversation. [See the documentation](https://dev.frontapp.com/reference/create-draft)",
  version: "0.0.3",
  type: "action",
  props: {
    frontApp,
    teamId: {
      propDefinition: [
        frontApp,
        "teamId",
      ],
    },
    channelId: {
      propDefinition: [
        frontApp,
        "channelId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the draft message. Accepts HTML",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the draft",
      optional: true,
    },
    authorId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      label: "Author ID",
    },
    to: {
      propDefinition: [
        frontApp,
        "to",
      ],
      optional: true,
    },
    cc: {
      propDefinition: [
        frontApp,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        frontApp,
        "bcc",
      ],
    },
    attachments: {
      propDefinition: [
        frontApp,
        "attachments",
      ],
    },
    mode: {
      propDefinition: [
        frontApp,
        "mode",
      ],
    },
    signatureId: {
      propDefinition: [
        frontApp,
        "signatureId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    shouldAddDefaultSignature: {
      propDefinition: [
        frontApp,
        "shouldAddDefaultSignature",
      ],
    },
    quoteBody: {
      propDefinition: [
        frontApp,
        "quoteBody",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.createDraft({
      $,
      channelId: this.channelId,
      data: {
        body: this.body,
        subject: this.subject,
        author_id: this.authorId,
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        attachments: this.attachments,
        mode: this.mode,
        signature_id: this.signatureId,
        should_add_default_signature: this.shouldAddDefaultSignature,
        quote_body: this.quoteBody,
      },
      headers: utils.hasArrayItems(this.attachments) && {
        "Content-Type": "multipart/form-data",
      },
    });
    $.export("$summary", `Successfully created draft with ID: ${response.id}`);
    return response;
  },
};
