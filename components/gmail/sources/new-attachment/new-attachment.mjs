import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "gmail-new-attachment",
  name: "New Attachment",
  description: "Emit new event for each attachment in a message received. This source is capped at 100 max new messages per run.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    q: {
      propDefinition: [
        common.props.gmail,
        "q",
      ],
    },
    labels: {
      propDefinition: [
        common.props.gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      console.log(`Fetching last ${constants.HISTORICAL_EVENTS} historical events...`);
      const response = await this.gmail.listMessages({
        q: this.q,
        labelIds: this.labels,
        maxResults: constants.HISTORICAL_EVENTS,
      });

      const messageIds = response?.messages?.map((message) => message.id);
      this.setLastMessageId(messageIds[0]);
      const messages = this.filterMessagesWithAttachments(
        await this.getMessages(messageIds.reverse()),
      );
      this.emitEvents(messages);
    },
  },
  methods: {
    ...common.methods,
    async getMessages(ids = []) {
      const promises = ids.map((id) => this.gmail.getMessage({
        id,
      }));
      return Promise.all(promises);
    },
    filterMessagesWithAttachments(messages) {
      return messages.filter(
        (message) => message.payload.parts.filter((part) => part.body?.attachmentId).length,
      );
    },
    generateMeta(attachment, message) {
      return {
        id: attachment.body.attachmentId,
        summary: `New attachment: ${attachment.filename}`,
        ts: message.internalDate,
      };
    },
    emitEvents(messages) {
      for (const message of messages) {
        const attachments = message.payload.parts.filter((part) => part.body.attachmentId);
        const numAttachments = attachments.length;
        if (!numAttachments) continue;
        const suffix = numAttachments === 1
          ? ""
          : "s";
        console.log(`Emitting event${suffix} for ${numAttachments} attachment${suffix} found for message`);
        for (const attachment of attachments) {
          const meta = this.generateMeta(attachment, message);
          this.$emit({
            message,
            attachment,
          }, meta);
        }
      }
    },
  },
  async run() {
    const lastMessageId = this.getLastMessageId();

    const response = await this.gmail.listMessages({
      q: this.q,
      labelIds: this.labels,
      maxResults: 100,
    });

    let messageIds = response?.messages?.map((message) => message.id);
    this.setLastMessageId(messageIds[0]);
    const index = messageIds.indexOf(lastMessageId);
    if (index !== -1) {
      messageIds = messageIds.slice(0, index);
    }

    const numMessages = messageIds.length;
    if (!numMessages) {
      console.log("No new message. Exiting...");
      return;
    }

    const suffix = numMessages === 1
      ? ""
      : "s";
    console.log(`Received ${numMessages} new message${suffix}. Please be patient while more information for each message is being fetched.`);
    const messages = this.filterMessagesWithAttachments(
      await this.getMessages(messageIds.reverse()),
    );
    this.emitEvents(messages);
  },
};
