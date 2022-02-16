// legacy_hash_id: a_67il6m
import moment from "moment";

export default {
  key: "pipedream-get-iso-string-n-days-ago",
  name: "Get ISO String N Days Ago",
  description: "Returns an ISO string (UTC TZ) N days ago",
  version: "0.1.1",
  type: "action",
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
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
