import common from "../common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-email",
  name: "New Email Event (Instant)",
  description: "Emit new event when an email is received in specified folders.",
  version: "0.0.10",
  type: "source",
  props: {
    ...common.props,
    folderIds: {
      type: "string[]",
      label: "Folder IDs to Monitor",
      description: "Specify the folder IDs or names in Outlook that you want to monitor for new emails. Leave empty to monitor all folders.",
      optional: true,
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        changeType: "created",
        resource: "/me/messages",
      });
    },
    async deactivate() {
      await this.deactivate();
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
      this.$emit(
        {
          email: item,
        },
        this.generateMeta(item),
      );
    },
    generateMeta(item) {
      return {
        id: item.id,
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
          const item = await this.microsoftOutlook.getMessage({
            resource: folder,
            messageId: resourceId,
          });
          this.emitEvent(item);
        },
      });
    }
  },
  sampleEmit,
};
