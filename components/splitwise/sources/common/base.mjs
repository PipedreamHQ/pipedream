import splitwise from "../../splitwise.app.mjs";

export default {
  props: {
    splitwise,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    logEmitEvent(list) {
      // eslint-disable-next-line multiline-ternary
      console.log(`Emitting ${list.length} event${list.length === 1 ? "" : "s"}...`);
    },
  },
};
