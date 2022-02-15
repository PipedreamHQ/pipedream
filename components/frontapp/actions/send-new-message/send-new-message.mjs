// legacy_hash_id: a_poikPY
import { axios } from "@pipedream/platform";

export default {
  key: "frontapp-send-new-message",
  name: "Send new message",
  description: "Sends a new message from a channel. It will create a new conversation.",
  version: "0.2.1",
  type: "action",
  props: {
    frontapp: {
      type: "app",
      app: "frontapp",
    },
    channel_id: {
      type: "string",
      description: "Id or address of the channel from which to send the message",
    },
    author_id: {
      type: "string",
      description: "ID of the teammate on behalf of whom the answer is sent",
      optional: true,
    },
    sender_name: {
      type: "string",
      description: "Name used for the sender info of the message",
      optional: true,
    },
    subject: {
      type: "string",
      description: "Subject of the message for email message",
      optional: true,
    },
    body: {
      type: "string",
      description: "Body of the message",
    },
    text: {
      type: "string",
      description: "Text version of the body for messages with non-text body",
      optional: true,
    },
    attachments: {
      type: "any",
      description: "Binary data of the attached files. Available only for [multipart request](https://dev.frontapp.com/#send-multipart-request).",
      optional: true,
    },
    options: {
      type: "object",
      description: "Sending options",
      optional: true,
    },
    options_tags: {
      type: "any",
      description: "List of tag names to add to the conversation (unknown tags will automatically be created)",
      optional: true,
    },
    options_archive: {
      type: "boolean",
      description: "Archive the conversation right when sending the message (Default: true)",
      optional: true,
    },
    to: {
      type: "any",
      description: "List of the recipient handles who will receive this message",
    },
    cc: {
      type: "any",
      description: "List of the recipient handles who will receive a copy of this message",
      optional: true,
    },
    bcc: {
      type: "any",
      description: "List of the recipient handles who will receive a blind copy of this message",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api2.frontapp.com/channels/${this.channel_id}/messages`,
      headers: {
        "Authorization": `Bearer ${this.frontapp.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      params: {
        author_id: this.author_id,
        sender_name: this.sender_name,
        subject: this.subject,
        body: this.body,
        text: this.text,
        attachments: this.attachments,
        options: this.options,
        options_tags: this.options_tags,
        options_archive: this.options_archive,
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
      },
    });
  },
};
