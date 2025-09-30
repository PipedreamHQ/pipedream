// legacy_hash_id: a_67il6m
import moment from "moment";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-get-iso-string-n-days-ago",
  name: "Get ISO String N Days Ago",
  description: "Returns an ISO string (UTC TZ) N days ago",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helper_functions,
    days: {
      type: "string",
      label: "N Days Ago",
    },
  },
  async run({ $ }) {
    $.export("date", moment().subtract(this.days, "days")
      .toISOString());
  },
};
