import common from "../common.mjs";
import md5 from "md5";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-email",
  name: "New Email Event (Instant)",
  description: "Emit new event when an email is received in specified folders.",
  version: "0.0.15",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folderIds: {
      propDefinition: [
        common.props.microsoftOutlook,
        "folderIds",
      ],
      optional: true,
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      this.db.set("sentItemFolderId", await this.getFolderIdByName("Sent Items"));
      this.db.set("draftsFolderId", await this.getFolderIdByName("Drafts"));

      const events = await this.getSampleEvents({
        pageSize: 25,
      });
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
    async getFolderIdByName(name) {
      const { value: folders } = await this.microsoftOutlook.listFolders();
      const folder = folders.find(({ displayName }) => displayName === name);
      return folder?.id;
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
        return this.folderIds.includes(item.parentFolderId);
      }
      // if no folderIds are specified, filter out items in Sent Items & Drafts
      const sentItemFolderId = this.db.get("sentItemFolderId");
      const draftsFolderId = this.db.get("draftsFolderId");
      return item.parentFolderId !== sentItemFolderId && item.parentFolderId !== draftsFolderId;
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
