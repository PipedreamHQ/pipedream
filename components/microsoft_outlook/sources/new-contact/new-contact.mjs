import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-contact",
  name: "New Contact Event (Instant)",
  description: "Emit new event when a new Contact is created",
  version: "0.0.19",
  type: "source",
  hooks: {
    ...common.hooks,
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
  methods: {
    ...common.methods,
    async getSampleEvents({ pageSize }) {
      return this.microsoftOutlook.listContacts({
        params: {
          $top: pageSize,
          $orderby: "createdDateTime desc",
        },
      });
    },
    emitEvent(item) {
      this.$emit({
        contact: item,
      }, this.generateMeta(item));
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New contact (ID:${item.id})`,
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
