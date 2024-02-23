import ncscale from "../../ncscale.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ncscale-push-log",
  name: "Push Log",
  description: "Pushes a new log entry to the ncscale app. [See the documentation](https://documentation.ncscale.io/docs/api/push-log)",
  version: "0.0.1",
  type: "action",
  props: {
    ncscale,
    message: ncscale.propDefinitions.message,
    timestamp: {
      ...ncscale.propDefinitions.timestamp,
      label: "Timestamp as createdAt",
    },
    severity: ncscale.propDefinitions.severity,
    eventName: {
      ...ncscale.propDefinitions.eventName,
      name: "event_name",
    },
    extra: ncscale.propDefinitions.extra,
  },
  async run({ $ }) {
    const response = await this.ncscale.pushLog({
      message: this.message,
      timestamp: this.timestamp,
      severity: this.severity,
      eventName: this.eventName,
      extra: this.extra,
    });
    $.export("$summary", "Successfully pushed log entry");
    return response;
  },
};
