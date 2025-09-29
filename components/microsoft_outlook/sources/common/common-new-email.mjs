import common from "./common.mjs";

export default {
  ...common,
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
        await this.emitEvent(item);
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
    isRelevant(item) {
      if (this.folderIds?.length) {
        return this.folderIds.includes(item.parentFolderId);
      }
      // if no folderIds are specified, filter out items in Sent Items & Drafts
      const sentItemFolderId = this.db.get("sentItemFolderId");
      const draftsFolderId = this.db.get("draftsFolderId");
      return item.parentFolderId !== sentItemFolderId && item.parentFolderId !== draftsFolderId;
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
  },
};
