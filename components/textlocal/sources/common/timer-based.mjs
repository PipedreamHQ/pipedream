import base from "./base.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
};
