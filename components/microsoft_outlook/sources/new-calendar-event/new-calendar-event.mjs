import common from "../common.mjs";

export default {
  ...common,
  key: "microsoft_outlook-new-calendar-event",
  name: "New Calendar Event",
  description: "Emit new event when a new Calendar event is created",
  version: "0.0.1",
  type: "source",
  hooks: {
    async activate() {
      await this.activate({
        changeType: "created",
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
            summary: `New calendar event (ID:${item.id})`,
          },
        );
      },
    });
  },
};
