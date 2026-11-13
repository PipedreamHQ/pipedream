import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-instant",
  name: "New Testimonial (Instant)",
  description: "Emit new event when a testimonial arrives through a form, a request, the API, the browser extension or by hand. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
      description: "Only emit events of this site, e.g. `pa_7Q2K9XH3AB`. Use **Find Site** to get the site ID. Leave it empty for every site.",
    },
    minRating: {
      propDefinition: [
        app,
        "minRating",
      ],
      description: "Only emit ratings of at least this many stars, e.g. `4`. Leave it empty to emit every one, with or without a rating.",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "testimonial.received";
    },
    getSummary(item) {
      return `New testimonial from ${item.testimonial?.person?.name || "someone"}`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.minRating || this.getRating(item) >= Number(this.minRating));
    },
  },
  sampleEmit,
};
