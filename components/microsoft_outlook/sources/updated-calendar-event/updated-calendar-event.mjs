import common from "../common.mjs";

export default {
  ...common,
  key: "microsoft_outlook-updated-calendar-event",
  name: "New Calendar Event Update",
  description: "Emit new event when a Calendar event is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async activate() {
      await this.activate({
        changeType: "updated",
        resource: "/me/events",
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
        const item = await this.microsoftOutlook.getCalendarEvent({
          eventId: resourceId,
        });
        this.$emit(
          {
            message: item,
          },
          {
            id: item.id,
            ts: Date.parse(item.createdDateTime),
            summary: `Calendar event updated (ID:${item.id})`,
          },
        );
      },
    });
  },
};
