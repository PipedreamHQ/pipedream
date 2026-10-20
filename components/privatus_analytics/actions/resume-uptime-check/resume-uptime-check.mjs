import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-resume-uptime-check",
  name: "Resume Uptime Check",
  description: "Resumes a paused uptime check. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    uptimeCheckId: {
      propDefinition: [
        app,
        "uptimeCheckId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/uptime/checks/${utils.segment(this.uptimeCheckId)}/resume.json`,
    });
    $.export("$summary", `Successfully resumed uptime check '${response.name}'`);
    return response;
  },
};
