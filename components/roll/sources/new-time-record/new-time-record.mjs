import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Time Created",
  key: "roll-new-time-record",
  description: "Emit new event when a time is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spondyr API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getFieldId() {
      return "TimeId";
    },
    getFieldResponse() {
      return "time";
    },
    getFn() {
      return this.roll.listTimes;
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

