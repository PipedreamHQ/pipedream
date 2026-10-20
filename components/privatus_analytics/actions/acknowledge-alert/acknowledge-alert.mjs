import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-acknowledge-alert",
  name: "Acknowledge Alert",
  description: "Acknowledges the open incident of an alert rule, so the team knows someone is on it. [See the documentation](https://privatusanalytics.com/docs/api)",
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
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/alerts/${utils.segment(this.alertId)}/acknowledge.json`,
    });
    $.export("$summary", `Successfully acknowledged alert '${response.name}'`);
    return response;
  },
};
