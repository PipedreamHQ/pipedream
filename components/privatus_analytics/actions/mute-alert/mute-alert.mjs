import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-mute-alert",
  name: "Mute Alert",
  description: "Silences the notifications of an alert rule for a number of minutes. It keeps recording incidents. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    alertId: {
      propDefinition: [
        app,
        "alertId",
      ],
    },
    minutes: {
      type: "integer",
      label: "Minutes",
      description: "Mute for this many minutes (default 60, maximum 43200 which is 30 days). 0 unmutes right away.",
      default: 60,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/alerts/${utils.segment(this.alertId)}/mute.json`,
      data: utils.compact({
        minutes: this.minutes,
      }),
    });
    $.export("$summary", `Successfully muted alert '${response.name}' for ${this.minutes ?? 60} minutes`);
    return response;
  },
};
