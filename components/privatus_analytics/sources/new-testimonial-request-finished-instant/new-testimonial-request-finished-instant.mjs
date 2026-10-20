import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-request-finished-instant",
  name: "New Testimonial Request Finished (Instant)",
  description: "Emit new event when a testimonial request finishes: every person replied, opted out or got every email. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
      optional: true,
      description: "Only emit events of this site. Leave it empty for every site.",
    },
    requestId: {
      propDefinition: [
        app,
        "testimonialRequestId",
      ],
      optional: true,
      description: "Only emit events of this request. Select a **Site** first. Leave it empty for every request.",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "testimonial_request.completed";
    },
    getSummary() {
      return "Testimonial request finished";
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.requestId || item.request_id === this.requestId);
    },
  },
  sampleEmit,
};
