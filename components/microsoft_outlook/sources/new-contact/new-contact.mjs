import common from "../common.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-contact",
  name: "New Contact Event",
  description: "Emit new event when a new Contact is created",
  version: "0.0.1",
  type: "source",
  hooks: {
    async activate() {
      await this.activate({
        changeType: "created",
        resource: "/me/contacts",
      });
    },
    async deactivate() {
      await this.deactivate();
    },
  },
  async run(event) {
    await this.run({
      event,
      emitFn: async ({ resourceId } = {}) => {
        const item = await this.microsoftOutlook.getContact({
          contactId: resourceId,
        });
        this.$emit(
          {
            contact: item,
          },
          {
            id: item.id,
            ts: Date.parse(item.createdDateTime),
            summary: `New contact (ID:${item.id})`,
          },
        );
      },
    });
  },
};
