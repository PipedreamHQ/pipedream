import common from "../common.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-email",
  name: "New Email Event",
  description: "Emit new event when an email received",
  version: "0.0.1",
  type: "source",
  hooks: {
    async activate() {
      await this.activate({
        changeType: "created",
        resource: "/me/mailfolders('inbox')/messages",
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
        const item = await this.microsoftOutlook.getMessage({
          messageId: resourceId,
        });
        this.$emit(
          {
            email: item,
          },
          {
            id: item.id,
            ts: Date.parse(item.createdDateTime),
            summary: `New email (ID:${item.id})`,
          },
        );
      },
    });
  },
};
