import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-import-message",
  name: "Import Message",
  description: "Appends a new message into an inbox. [See the documentation](https://dev.frontapp.com/reference/import-inbox-message).",
  version: "0.1.9",
  type: "action",
  props: {
    frontApp,
    inboxId: {
      propDefinition: [
        frontApp,
        "inboxId",
      ],
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "Handle used to reach the contact. Can be an email address, a twitter, handle, a phone number, custom handle ...",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact.",
      optional: true,
    },
    authorId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      label: "Author ID",
      description: "ID of the teammate who is the author of the message. Ignored if the message is inbound.",
      optional: true,
    },
    to: {
      propDefinition: [
        frontApp,
        "to",
      ],
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
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the message.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the message.",
    },
    bodyFormat: {
      propDefinition: [
        frontApp,
        "bodyFormat",
      ],
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "External identifier of the message. Front won't import two messages with the same external ID.",
    },
    createdAt: {
      type: "integer",
      label: "Created At",
      description: "Date at which the message has been sent or received. A timestamp is expected as in `1655507769`",
      default: Math.floor(Date.now() / 1000),
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the message to import. Can be one of: `email`, `sms`, `intercom`, `custom`. (Default: `email`)",
      optional: true,
      options: [
        "email",
        "sms",
        "intercom",
        "custom",
      ],
    },
    assigneeId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      label: "Assignee ID",
      description: "ID of the teammate who will be assigned to the conversation.",
      optional: true,
    },
    tags: {
      propDefinition: [
        frontApp,
        "tagIds",
      ],
      optional: true,
      description: "List of tag names to add to the conversation (unknown tags will automatically be created)",
    },
    threadRef: {
      propDefinition: [
        frontApp,
        "threadRef",
      ],
    },
    isInbound: {
      type: "boolean",
      label: "Is Inbound",
      description: "Whether or not the message is received (inbound) or sent (outbound) by you",
    },
    isArchive: {
      type: "boolean",
      label: "Is Archive",
      description: "Whether or not the message should be directly archived once imported. (Default: true)",
      optional: true,
    },
    shouldSkipRules: {
      type: "boolean",
      label: "Should Skip Rules",
      description: "Whether or not the rules should apply to this message. (Default: true)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      inboxId,
      handle,
      name,
      authorId,
      subject,
      body,
      bodyFormat,
      externalId,
      createdAt,
      type,
      assigneeId,
      threadRef,
      isArchive,
      isInbound,
      shouldSkipRules,
    } = this;

    const to = utils.parse(this.to);
    const cc = utils.parse(this.cc);
    const bcc = utils.parse(this.bcc);
    const tags = utils.parse(this.tags);

    const data = {
      sender: {
        author_id: authorId,
        name,
        handle,
      },
      to,
      cc,
      bcc,
      subject,
      body,
      body_format: bodyFormat,
      external_id: externalId,
      created_at: createdAt,
      type,
      assignee_id: assigneeId,
      tags,
      metadata: {
        thread_ref: threadRef,
        is_inbound: isInbound,
        is_archived: isArchive,
        should_skip_rules: shouldSkipRules,
      },
    };

    const response =
      await this.frontApp.importMessage({
        inboxId,
        data,
      });

    const { message_uid: messageId } = response;

    $.export("$summary", `Successfully imported message with ID ${messageId}`);

    return response;
  },
};
