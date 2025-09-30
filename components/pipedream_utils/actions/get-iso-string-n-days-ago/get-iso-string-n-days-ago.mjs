// legacy_hash_id: a_67il6m
import moment from "moment";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-get-iso-string-n-days-ago",
  name: "Helper Functions - Get ISO String N Days Ago",
  description: "Returns an ISO string (UTC TZ) N days ago",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
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
