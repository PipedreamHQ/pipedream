// legacy_hash_id: a_PNiBGY
import moment from "moment-timezone";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-get-current-time-in-specific-timezone",
  name: "Get Current Time in Timezone",
  description: "Returns the current time, tied to this workflow invocation, in the target timezone",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helper_functions,
    timezone: {
      type: "string",
      description: "The IANA timezone name, e.g. `America/Los_Angeles`. [See the full list here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).",
    },
  },
  async run() {
    return moment.tz(new Date(), this.timezone).format();
  },
};
