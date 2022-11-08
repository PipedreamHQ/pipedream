import base from "./base.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    timer: {
      label: "Timer",
      description: "The timer that will trigger the event source",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
};
