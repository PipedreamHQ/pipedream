/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */
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
