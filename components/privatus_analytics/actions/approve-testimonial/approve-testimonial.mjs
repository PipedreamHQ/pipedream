import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-approve-testimonial",
  name: "Approve Testimonial",
  description: "Approves a testimonial, so it can be shown on walls and widgets. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    testimonialId: {
      propDefinition: [
        app,
        "testimonialId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/testimonials/${utils.segment(this.testimonialId)}/approve.json`,
    });
    $.export("$summary", `Successfully approved testimonial ${this.testimonialId}`);
    return response;
  },
};
