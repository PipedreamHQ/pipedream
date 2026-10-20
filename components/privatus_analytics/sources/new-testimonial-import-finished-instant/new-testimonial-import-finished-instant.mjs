import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-import-finished-instant",
  name: "New Testimonial Import Finished (Instant)",
  description: "Emit new event when an import of testimonials or reviews finishes reading, or fails. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "testimonial_import.finished";
    },
    getSummary(item) {
      return `Testimonial import finished (${item.new ?? 0} new)`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId);
    },
  },
  sampleEmit,
};
