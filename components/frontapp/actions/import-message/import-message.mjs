import frontApp from "../../frontapp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "frontapp-import-message",
  name: "Import Message",
  description: "Appends a new message into an inbox. [See the docs here](https://dev.frontapp.com/reference/import-inbox-message",
  version: "0.1.3",
  type: "action",
  props: {
    frontApp,
    inboxId: {
      type: "string",
      description: "Id of the inbox into which the message should be append.",
    },
    handle: {
      type: "string",
      description: "Handle used to reach the contact. Can be an email address, a twitter, handle, a phone number, custom handle ...",
    },
    name: {
      type: "string",
      description: "Name of the contact.",
      optional: true,
    },
    authorId: {
      type: "string",
      description: "ID of the teammate who is the author of the message. Ignored if the message is inbound.",
      optional: true,
    },
    to: {
      type: "string[]",
      description: "List of recipient handles who received the message.",
    },
    cc: {
      type: "string[]",
      description: "List of recipient handles who received a copy of the message.",
      optional: true,
    },
    bcc: {
      type: "string[]",
      description: "List of the recipeient handles who received a blind copy of the message.",
      optional: true,
    },
    subject: {
      type: "string",
      description: "Subject of the message.",
      optional: true,
    },
    body: {
      type: "string",
      description: "Body of the message.",
    },
    bodyFormat: {
      type: "string",
      description: "Format of the message body. Ignored if the message type is not email. Can be one of: 'html', 'markdown'. (Default: 'markdown')",
      optional: true,
      options: [
        "html",
        "markdown",
      ],
    },
    externalId: {
      type: "string",
      description: "External identifier of the message. Front won't import two messages with the same external ID.",
    },
    createdAt: {
      type: "integer",
      description: "Date at which the message as been sent or received. A timestamp is expected as in 1453770984.123",
    },
    type: {
      type: "string",
      description: "Type of the message to import. Can be one of: 'email', 'sms', 'intercom', 'custom'. (Default: 'email')",
      optional: true,
      options: [
        "email",
        "sms",
        "intercom",
        "custom",
      ],
    },
    assigneeId: {
      type: "string",
      description: "ID of the teammate who will be assigned to the conversation.",
      optional: true,
    },
    tags: {
      type: "string[]",
      description: "List of tag names to add to the conversation (unknown tags will automatically be created)",
      optional: true,
    },
    threadRef: {
      type: "string",
      description: "Custom reference which will be used to thread messages. If you omit this field, we'll thread by sender instead.",
      optional: true,
    },
    isInbound: {
      type: "boolean",
      description: "Whether or not the message is received (inbound) or sent (outbound) by you",
    },
    isArchive: {
      type: "boolean",
      description: "Whether or not the message should be directly archived once imported. (Default: true)",
      optional: true,
    },
    shouldSkipRules: {
      type: "boolean",
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
        handle,
        name,
        author_id: authorId,
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

    const effectiveRequestBody = JSON.stringify(data);
    $.export("effective_request_body", effectiveRequestBody);

    const response =
      await this.frontApp.importMessage({
        params: {
          inbox_id: inboxId,
        },
        data,
      });

    const { message_uid: messageId } = response;

    $.export("$summary", `Successfully imported message with ID ${messageId}`);

    return response;
  },
};
