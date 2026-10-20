import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-approved-instant",
  name: "New Testimonial Approved (Instant)",
  description: "Emit new event when a testimonial is approved, so it can be shown on walls and widgets. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
    minRating: {
      type: "string",
      label: "Minimum Rating",
      description: "Only emit ratings of at least this many stars. Leave it empty to emit every one, with or without a rating.",
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "testimonial.approved";
    },
    getSummary(item) {
      return `Testimonial approved: ${item.testimonial?.id}`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.minRating || this.getRating(item) >= Number(this.minRating));
    },
  },
  sampleEmit,
};
