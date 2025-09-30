// legacy_hash_id: a_m8ijqa
import moment from "moment-timezone";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-get-time-in-specific-timezone",
  name: "Get Time in Timezone",
  description: "Given an ISO 8601 timestamp, and a timezone, convert the time to the target timezone.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helper_functions,
    time: {
      type: "string",
      label: "ISO 8601 Time",
      description: "An [ISO 8601 string](https://en.wikipedia.org/wiki/ISO_8601) representing the time you'd like to convert to your target timezone. If this timestamp doesn't have a timezone component, it's assumed to be in UTC.",
    },
    timezone: {
      type: "string",
      description: "The IANA timezone name, e.g. `America/Los_Angeles`. [See the full list here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).",
    },
  },
  async run() {
    return moment.tz(this.time, this.timezone).format();
  },
};
