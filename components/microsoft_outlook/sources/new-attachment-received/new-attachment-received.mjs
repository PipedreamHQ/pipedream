import common from "../common/common-new-email.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-attachment-received",
  name: "New Attachment Received (Instant)",
  description: "Emit new event when a new email containing one or more attachments arrives in a specified Microsoft Outlook folder.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents({ pageSize }) {
      const folders = this.folderIds?.length
        ? this.folderIds.map((id) => `/me/mailFolders/${id}/messages`)
        : [
          "/me/messages",
        ];

      const messagesWithAttachments = [];
      for (const folder of folders) {
        const { value: messages } = await this.microsoftOutlook.listMessages({
          resource: folder,
          params: {
            $top: pageSize,
            $filter: "hasAttachments eq true",
          },
        });
        messagesWithAttachments.push(...messages);
      }

      const attachments = [];
      for (const message of messagesWithAttachments) {
        const messageAttachments = await this.getMessageAttachments(message);
        attachments.push(...messageAttachments);
      }
      return attachments;
    },
    async getMessageAttachments(message) {
      const { value: attachments } = await this.microsoftOutlook.listAttachments({
        messageId: message.id,
      });
      if (!attachments?.length) {
        return [];
      }
      return attachments.map((attachment) => ({
        ...attachment,
        messageId: message.id,
        messageSubject: message.subject,
        messageSender: message.sender,
        messageReceivedDateTime: message.receivedDateTime,
        parentFolderId: message.parentFolderId,
        contentBytes: undefined,
      }));
    },
    emitEvent(item) {
      if (this.isRelevant(item)) {
        this.$emit(item, this.generateMeta(item));
      }
    },
    generateMeta(item) {
      return {
        id: item.contentId,
        summary: `New attachment ${item.name}`,
        ts: Date.parse(item.messageReceivedDateTime),
      };
    },
  },
  async run(event) {
    const folders = this.folderIds?.length
      ? this.folderIds.map((id) => `/me/mailFolders/${id}/messages`)
      : [
        "/me/messages",
      ];

    for (const folder of folders) {
      await this.run({
        event,
        emitFn: async ({ resourceId } = {}) => {
          try {
            const message = await this.microsoftOutlook.getMessage({
              resource: folder,
              messageId: resourceId,
            });
            if (message.hasAttachments) {
              const attachments = await this.getMessageAttachments(message);
              attachments.forEach((item) => this.emitEvent(item));
            }
          } catch {
            console.log(`Could not fetch message with ID: ${resourceId}`);
          }
        },
      });
    }
  },
};
