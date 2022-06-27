import github from "../../github.app.mjs";

export default {
  props: {
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    db: "$.service.db",
  },
};
