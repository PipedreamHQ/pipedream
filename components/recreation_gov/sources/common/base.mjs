import app from "../../recreation_gov.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    getResourceFnConfig() {
      throw new Error("getResourceFnConfig() is not implemented!");
    },
    getMeta() {
      throw new Error("getMeta() is not implemented!");
    },
  },
};
