const base = require("./base");

module.exports = {
  ...base,
  props: {
    ...base.props,
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Mailgun for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    db: "$.service.db",
  },
};
