import common from "./common.js";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Trello API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
};
