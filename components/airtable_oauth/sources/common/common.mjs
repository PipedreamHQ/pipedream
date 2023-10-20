import airtable from "../../airtable_oauth.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../../../airtable/sources/common/common.mjs";

export default {
  props: {
    airtable,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
  },
  hooks: {
    ...common.hooks,
  },
  methods: {
    ...common.methods,
  },
};
