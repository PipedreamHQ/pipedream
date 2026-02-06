import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "microsoft_365_people-new-contact-created",
  name: "New Contact Created (Instant)",
  description: "Emit new event when a new contact is created in a folder.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.microsoftOutlook,
        "folderId",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        changeType: "created",
        resource: this.folderId
          ? `/me/contactFolders/${this.folderId}/contacts`
          : "/me/contacts",
      });
    },
    async deactivate() {
      await this.deactivate();
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      return this.folderId
        ? this.microsoftOutlook.listContactsInFolder({
          folderId: this.folderId,
        })
        : this.microsoftOutlook.listContacts();
    },
    generateMeta(item) {
      return {
        id: item.id.slice(-64),
        summary: `${item.displayName}` || `${item.id}`,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
  async run(event) {
    await this.run({
      event,
      emitFn: async ({ resourceId } = {}) => {
        const item = await this.microsoftOutlook.getContact({
          contactId: resourceId,
        });
        this.emitEvent(item);
      },
    });
  },
};
