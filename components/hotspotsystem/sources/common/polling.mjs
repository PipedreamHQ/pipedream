import app from "../../hotspotsystem.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Plivo API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
};
