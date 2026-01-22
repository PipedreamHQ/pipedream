import common from "../common/common.mjs";
import taskScheduler from "@pipedream/pipedream/sources/new-scheduled-tasks/new-scheduled-tasks.mjs";

export default {
  ...common,
  key: "microsoft_outlook_calendar-new-upcoming-event",
  name: "New Upcoming Calendar Event",
  description: "Emit new event when a Calendar event is upcoming, this source is using `reminderMinutesBeforeStart` property of the event to determine the time it should emit.",
  version: "0.0.6",
  type: "source",
  props: {
    ...common.props,
    pipedream: taskScheduler.props.pipedream,
  },
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
    ...taskScheduler.methods,
    ...common.methods,
    _hasDeployed() {
      const result = this.db.get("hasDeployed");
      this.db.set("hasDeployed", true);
      return result;
    },
    subtractMinutes(date, minutes) {
      return date.getTime() - minutes * 60000;
    },
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
        summary: `Upcoming event - ${item.subject}`,
        ts: +Date.parse(item.createdDateTime),
      };
    },
  },
  async run(event) {
    if (event.$channel === this.selfChannel()) {
      const item = await this.microsoftOutlook.getCalendarEvent({
        eventId: event.eventId,
      });
      // checking if the event was modified after this scheduling
      if (item.lastModifiedDateTime === event.lastModifiedControl) {
        this.emitEvent(item);
      }
      return;
    }
    await this.run({
      event,
      emitFn: async ({ resourceId } = {}) => {
        if (!this._hasDeployed()) {
          await this.selfSubscribe();
        }
        const item = await this.microsoftOutlook.getCalendarEvent({
          eventId: resourceId,
        });
        if (event.$channel !== this.selfChannel()) {
          const startTime = new Date(item.start.dateTime || item.start.date);
          const reminderMinutesBeforeStart = item.reminderMinutesBeforeStart || 15;
          const later = new Date(this.subtractMinutes(startTime, reminderMinutesBeforeStart));
          const newEvent = {
            lastModifiedControl: item.lastModifiedDateTime,
            eventId: resourceId,
          };
          this.emitScheduleEvent(newEvent, later);
        }
      },
    });
  },
};
