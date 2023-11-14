import dromo from "../../dromo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    dromo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    schemaId: {
      propDefinition: [
        dromo,
        "schemaId",
      ],
    },
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
