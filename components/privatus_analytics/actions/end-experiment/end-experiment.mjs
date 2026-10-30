import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-end-experiment",
  name: "End Experiment",
  description: "Ends an experiment. This action does not choose a winner. [See the documentation](https://privatusanalytics.com/docs/api)",
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
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/experiments/${utils.segment(this.experimentId)}/end.json`,
    });
    $.export("$summary", `Successfully ended experiment '${response.name}'`);
    return response;
  },
};
