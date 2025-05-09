import common from "../common/base.mjs";

export default {
  ...common,
  key: "planning_center-new-calendar-event",
  name: "New Calendar Event",
  description: "Emit new event when a new calendar event is created. [See the documentation](https://developer.planning.center/docs/#/apps/calendar/2022-07-07/vertices/event)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.planningCenter.getCalendarEvents;
    },
    isSorted() {
      return false;
    },
    getSummary(item) {
      return `New Calendar Event with ID: ${item.id}`;
    },
  },
};
