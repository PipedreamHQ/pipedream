// legacy_hash_id: a_PNiBGY
import moment from "moment-timezone";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-get-current-time-in-specific-timezone",
  name: "Helper Functions - Get Current Time in Timezone",
  description: "Returns the current time, tied to this workflow invocation, in the target timezone",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    timezone: {
      type: "string",
      description: "The IANA timezone name, e.g. `America/Los_Angeles`. [See the full list here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).",
    },
  },
  async run() {
    return moment.tz(new Date(), this.timezone).format();
  },
};
