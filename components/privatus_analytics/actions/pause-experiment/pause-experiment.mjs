import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-pause-experiment",
  name: "Pause Experiment",
  description: "Pauses an experiment. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    experimentId: {
      propDefinition: [
        app,
        "experimentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/experiments/${utils.segment(this.experimentId)}/pause.json`,
    });
    $.export("$summary", `Successfully paused experiment '${response.name}'`);
    return response;
  },
};
