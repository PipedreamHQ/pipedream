import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_outlook_calendar-deleted-calendar-event",
  name: "Calendar Event Deleted (Instant)",
  description: "Emit new event when a Calendar event is deleted",
  version: "0.0.1",
  type: "source",
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        changeType: "deleted",
        resource: "/me/events",
      });
    },
    async deactivate() {
      await this.deactivate();
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      return {
        value: [],
      };
    },
    emitEvent(notification) {
      const eventId = notification.resourceData?.id;
      const ts = Date.now();
      this.$emit({
        eventId,
        changeType: notification.changeType,
        subscriptionId: notification.subscriptionId,
        tenantId: notification.tenantId,
        notificationTimestamp: new Date(ts).toISOString(),
      }, {
        id: eventId || `deleted-${ts}`,
        summary: `Calendar event deleted (ID:${eventId})`,
        ts,
      });
    },
  },
  async run(event) {
    if (event.interval_seconds || event.cron) {
      await this.microsoftOutlook.renewHook({
        hookId: this.db.get("hookId"),
        data: {
          expirationDateTime: this.getIntervalEnd(),
        },
      });
      return;
    }
    if (event.query && event.query.validationToken) {
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
        body: event.query.validationToken,
      });
    } else {
      this.http.respond({
        status: 202,
      });
      const eventBody = JSON.parse(event.bodyRaw);
      for (const notification of eventBody.value) {
        if (!notification.clientState || notification.clientState === this.db.get("clientState")) {
          this.emitEvent(notification);
        }
      }
    }
  },
};
