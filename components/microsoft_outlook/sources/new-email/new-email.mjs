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
      async options() {
        const { value: folders } = await this.listFolders();
        return folders?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      this.db.set("sentItemFolderId", await this.getSentItemFolderId());

      const events = await this.getSampleEvents({
        pageSize: 25,
      }); console.log(events);
      if (!events || events.length == 0) {
        return;
      }
      for (const item of events) {
        this.emitEvent(item);
      }
    },
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
    listFolders() {
      return this.microsoftOutlook._makeRequest({
        path: "/me/mailFolders",
      });
    },
    async getSentItemFolderId() {
      const { value: folders } = await this.listFolders();
      const { id } = folders.find(({ displayName }) => displayName === "Sent Items");
      return id;
    },
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
    isRelevant(item) {
      if (this.folderIds?.length) {
        return true;
      }
      // if no folderIds are specified, filter out items in Sent Items
      const sentItemFolderId = this.db.get("sentItemFolderId");
      return item.parentFolderId !== sentItemFolderId;
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
          try {
            const item = await this.microsoftOutlook.getMessage({
              resource: folder,
              messageId: resourceId,
            });
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
