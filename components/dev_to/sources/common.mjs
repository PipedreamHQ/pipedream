export default {
  props: {
    db: "$.service.db",
    timer: {
      label: "Timer",
      description: "How often to poll Dev.to for new articles",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
};
