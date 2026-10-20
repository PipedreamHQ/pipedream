import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-moved-to-trash-instant",
  name: "New Testimonial Moved to Trash (Instant)",
  description: "Emit new event when a testimonial is moved to the trash. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
      return "testimonial.trashed";
    },
    getSummary(item) {
      return `Testimonial moved to trash: ${item.testimonial_id}`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId);
    },
  },
  sampleEmit,
};
