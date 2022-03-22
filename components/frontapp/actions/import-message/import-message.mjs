// legacy_hash_id: a_a4iKLb
import { axios } from "@pipedream/platform";

export default {
  key: "frontapp-import-message",
  name: "Import Message",
  description: "Appends a new message into an inbox.",
  version: "0.1.2",
  type: "action",
  props: {
    frontapp: {
      type: "app",
      app: "frontapp",
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
    author_id: {
      type: "string",
      description: "ID of the teammate who is the author of the message. Ignored if the message is inbound.",
      optional: true,
    },
    to: {
      type: "any",
      description: "List of recipient handles who received the message.",
    },
    cc: {
      type: "any",
      description: "List of recipient handles who received a copy of the message.",
      optional: true,
    },
    bcc: {
      type: "any",
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
    body_format: {
      type: "string",
      description: "Format of the message body. Ignored if the message type is not email. Can be one of: 'html', 'markdown'. (Default: 'markdown')",
      optional: true,
      options: [
        "html",
        "markdown",
      ],
    },
    external_id: {
      type: "string",
      description: "External identifier of the message. Front won't import two messages with the same external ID.",
    },
    created_at: {
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
    assignee_id: {
      type: "string",
      description: "ID of the teammate who will be assigned to the conversation.",
      optional: true,
    },
    tags: {
      type: "any",
      description: "List of tag names to add to the conversation (unknown tags will automatically be created)",
      optional: true,
    },
    thread_ref: {
      type: "string",
      description: "Custom reference which will be used to thread messages. If you omit this field, we'll thread by sender instead.",
      optional: true,
    },
    is_inbound: {
      type: "boolean",
      description: "Whether or not the message is received (inbound) or sent (outbound) by you",
    },
    archive: {
      type: "boolean",
      description: "Whether or not the message should be directly archived once imported. (Default: true)",
      optional: true,
    },
    should_skip_rules: {
      type: "boolean",
      description: "Whether or not the rules should apply to this message. (Default: true)",
      optional: true,
    },
    inbox_id: {
      type: "string",
      description: "Id of the inbox into which the message should be append.",
    },
  },
  async run({ $ }) {
  //FrontApp api specifies body should be sent as a data binary.
  //One way to comply with this is to populate an JS object normally
  //and stringify it before requesting.

    var messageToImportData = {
      sender: {
        handle: this.handle,
        name: this.name,
        author_id: this.author_id,
      },
      to: typeof this.to == "undefined"
        ? this.to
        : JSON.parse(this.to),
      cc: typeof this.cc == "undefined"
        ? this.cc
        : JSON.parse(this.cc),
      bcc: typeof this.bcc == "undefined"
        ? this.bcc
        : JSON.parse(this.bcc),
      subject: this.subject,
      body: this.body,
      body_format: this.body_format,
      external_id: this.external_id,
      created_at: this.created_at,
      type: this.type,
      assignee_id: this.assignee_id,
      tags: typeof this.tags == "undefined"
        ? this.tags
        : JSON.parse(this.tags),
      metadata: {
        thread_ref: this.thread_ref,
        is_inbound: new Boolean(this.is_inbound),
        is_archived: typeof this.archive == "undefined"
          ? true
          : new Boolean(this.archive),
        should_skip_rules: typeof this.should_skip_rules == "undefined"
          ? true
          : new Boolean(this.should_skip_rules),
      },
    };

    const effectiveRequestBody = JSON.stringify(messageToImportData);
    $.export("effective_request_body", effectiveRequestBody);

    return await axios($, {
      method: "post",
      url: `https://api2.frontapp.com/inboxes/${this.inbox_id}/messages`,
      headers: {
        "Authorization": `Bearer ${this.frontapp.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: effectiveRequestBody,
    });
  },
};
