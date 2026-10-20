import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-request-sent-instant",
  name: "New Testimonial Request Sent (Instant)",
  description: "Emit new event when the first emails of a testimonial request go out. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
      return "testimonial_request.sent";
    },
    getSummary(item) {
      return `Testimonial request sent to ${item.recipients_count} people`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.requestId || item.request_id === this.requestId);
    },
  },
  sampleEmit,
};
