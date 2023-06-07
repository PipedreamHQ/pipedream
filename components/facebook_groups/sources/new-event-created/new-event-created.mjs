import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-new-event-created",
  name: "New Event Created",
  description: "Emit new event when a new event is created in a group",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(event) {
      return {
        id: event.id,
        summary: event.name,
        ts: event.created_time,
      };
    },
    getArgs() {
      return {
        fn: this.facebookGroups.listEvents,
        args: {
          groupId: this.group,
        },
      };
    },
  },
};
