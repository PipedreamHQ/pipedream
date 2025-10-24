import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_outlook_calendar-updated-calendar-event",
  name: "New Calendar Event Update (Instant)",
  description: "Emit new event when a Calendar event is updated",
  version: "0.0.8",
  type: "source",
  hooks: {
    ...common.hooks,
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
  methods: {
    ...common.methods,
    async getSampleEvents({ pageSize }) {
      return this.microsoftOutlook.listCalendarEvents({
        params: {
          $top: pageSize,
          $orderby: "lastModifiedDateTime desc",
        },
      });
    },
    emitEvent(item) {
      this.$emit({
        message: item,
      }, this.generateMeta(item));
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `Calendar event updated (ID:${item.id})`,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
  async run(event) {
    await this.run({
      event,
      emitFn: async ({ resourceId } = {}) => {
        const item = await this.microsoftOutlook.getCalendarEvent({
          eventId: resourceId,
        });
        this.emitEvent(item);
      },
    });
  },
};
