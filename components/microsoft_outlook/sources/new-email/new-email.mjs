import common from "../common.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-email",
  name: "New Email Event (Instant)",
  description: "Emit new event when an email received",
  version: "0.0.3",
  type: "source",
  hooks: {
    ...common.hooks,
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
  methods: {
    ...common.methods,
    async getSampleEvents({ pageSize }) {
      return this.microsoftOutlook.listMessages({
        params: {
          $top: pageSize,
          $orderby: "createdDateTime desc",
        },
      });
    },
    emitEvent(item) {
      this.$emit({
        email: item,
      }, this.generateMeta(item));
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
    await this.run({
      event,
      emitFn: async ({ resourceId } = {}) => {
        const item = await this.microsoftOutlook.getMessage({
          messageId: resourceId,
        });
        this.emitEvent(item);
      },
    });
  },
};
