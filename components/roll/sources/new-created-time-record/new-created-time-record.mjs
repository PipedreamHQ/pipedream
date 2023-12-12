import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Created Time",
  key: "roll-new-created-time-record",
  description: "Emit new event when a time is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "TimeId";
    },
    getFieldResponse() {
      return "time";
    },
    getQuery() {
      return "listTimes";
    },
    getOrderField() {
      return "{\"TimeId\": \"DESC\"}";
    },
    getDataToEmit({
      TimeId,
      Created,
    }) {
      const dateTime = Created || new Date().getTime();
      return {
        id: TimeId,
        summary: `New time with TimeId ${TimeId} was successfully created!`,
        ts: dateTime,
      };
    },
  },
};
