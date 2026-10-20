import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-get-testimonial",
  name: "Get Testimonial",
  description: "Gets one testimonial with everything about it, such as the person, the media and the tags. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": true,
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
      method: "GET",
      path: `/sites/${utils.segment(this.siteId)}/testimonials/${utils.segment(this.testimonialId)}.json`,
    });
    $.export("$summary", `Successfully retrieved testimonial ${this.testimonialId}`);
    return response;
  },
};
