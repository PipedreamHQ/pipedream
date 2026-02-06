import common from "../common/common-new-email.mjs";
import { Readable } from "stream";

export default {
  ...common,
  key: "microsoft_outlook-new-attachment-received",
  name: "New Attachment Received (Instant)",
  description: "Emit new event when a new email containing one or more attachments arrives in a specified Microsoft Outlook folder.",
  version: "0.1.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload attachment to your File Stash and emit temporary download link to the file. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
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
    async stashAttachment(item) {
      const messageAttachment =  await this.microsoftOutlook.getAttachment({
        messageId: item.messageId,
        attachmentId: item.id,
        responseType: "arraybuffer",
      });
      const rawcontent = messageAttachment.toString("base64");
      const buffer = Buffer.from(rawcontent, "base64");
      const filepath = `${item.id}/${item.name}`;
      // Upload the attachment to the configured directory (File Stash) so it
      // can be accessed later.
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        item.contentType,
        buffer.length,
      );
      // Return file details and temporary download link:
      // { path, get_url, s3Key, type }
      return await file.withoutPutUrl().withGetUrl();
    },
    async emitEvent(item) {
      if (this.isRelevant(item)) {
        if (this.includeLink) {
          item.file = await this.stashAttachment(item);
        }
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
              for (const item of attachments) {
                await this.emitEvent(item);
              }
            }
          } catch {
            console.log(`Could not fetch message with ID: ${resourceId}`);
          }
        },
      });
    }
  },
};
