import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-pin-testimonial",
  name: "Pin Testimonial",
  description: "Pins a testimonial so it is shown first, or unpins it. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    testimonialId: {
      propDefinition: [
        app,
        "testimonialId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    pinned: {
      type: "boolean",
      label: "Pinned",
      description: "Whether the testimonial is pinned. Turn it off to unpin.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/testimonials/${utils.segment(this.testimonialId)}/pin.json`,
      data: utils.compact({
        pinned: this.pinned,
      }),
    });
    $.export("$summary", `Successfully ${this.pinned === false
      ? "unpinned"
      : "pinned"} testimonial ${this.testimonialId}`);
    return response;
  },
};
