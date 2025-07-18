import neon from "../../neon_postgres.app.mjs";
import common from "@pipedream/postgresql/sources/common.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  props: {
    postgresql: neon,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
};
