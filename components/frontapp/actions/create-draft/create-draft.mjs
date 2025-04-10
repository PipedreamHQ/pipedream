import frontApp from "../../frontapp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "frontapp-create-draft",
  name: "Create Draft",
  description: "Create a draft message which is the first message of a new conversation. [See the documentation](https://dev.frontapp.com/reference/create-draft)",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
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
      optional: true,
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
  },
  async run({ $ }) {
    const response = await this.frontApp.createDraft({
      $,
      channelId: this.channelId,
      data: {
        body: this.body,
        author_id: this.authorId,
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        attachments: this.attachments,
      },
      headers: utils.hasArrayItems(this.attachments) && {
        "Content-Type": "multipart/form-data",
      },
    });
    $.export("$summary", `Successfully created draft with ID: ${response.id}`);
    return response;
  },
};
