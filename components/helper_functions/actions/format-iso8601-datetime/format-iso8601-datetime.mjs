// legacy_hash_id: a_nji3no
import moment from "moment";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-format-iso8601-datetime",
  name: "Format ISO8601 Date/Time for Google Sheets",
  description: "Use the moment.js npm package to format an ISO8601 date/time as Google Sheets friendly formats. This action exports an object with compound date/time, date-only, and time-only values.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helper_functions,
    iso8601: {
      type: "string",
      label: "ISO 8601 Date/Time",
    },
  },
  async run() {
    return {
      date_time: moment(this.iso8601).format("MM/DD/YYYY h:mm:ss a"),
      date: moment(this.iso8601).format("MM/DD/YYYY"),
      time: moment(this.iso8601).format("h:mm:ss a"),
    };
  },
};
