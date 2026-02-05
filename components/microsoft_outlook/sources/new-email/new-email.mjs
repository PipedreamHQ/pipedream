import md5 from "md5";
import common from "../common/common-new-email.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-email",
  name: "New Email Event (Instant)",
  description: "Emit new event when an email is received in specified folders.",
  version: "0.1.8",
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

      const results = [];
      for (const folder of folders) {
        const { value: messages } = await this.microsoftOutlook.listMessages({
          resource: folder,
          params: {
            $top: pageSize,
            $orderby: "createdDateTime desc",
          },
        });
        results.push(...messages);
      }
      return results;
    },
    emitEvent(item) {
      if (this.isRelevant(item)) {
        this.$emit(
          {
            email: item,
          },
          this.generateMeta(item),
        );
      }
    },
    generateMeta(item) {
      return {
        id: md5(item.id), // id > 64 characters, so dedupe on hash of id
        summary: `New email (ID:${item.id})`,
        ts: Date.parse(item.createdDateTime),
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
            const item = await this.microsoftOutlook.getMessage({
              resource: folder,
              messageId: resourceId,
            });
            if (item.hasAttachments) {
              const attachments = await this.getMessageAttachments(item);
              item.attachments = attachments;
            }
            this.emitEvent(item);
          } catch {
            console.log(`Could not fetch message with ID: ${resourceId}`);
          }
        },
      });
    }
  },
  sampleEmit,
};
