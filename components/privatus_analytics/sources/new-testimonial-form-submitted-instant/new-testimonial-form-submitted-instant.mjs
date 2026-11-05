import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-testimonial-form-submitted-instant",
  name: "New Testimonial Form Submitted (Instant)",
  description: "Emit new event when someone completes a testimonial form, whether it became a testimonial or private feedback. Never includes their email address. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
    formId: {
      propDefinition: [
        app,
        "testimonialFormId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
      optional: true,
      description: "Only emit submissions of this form, e.g. `frm_3C8V5ZP2RN`. Set **Site** first. Use **Find Testimonial Forms** to get the form ID. Leave it empty for every form.",
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
      return "testimonial_form.submitted";
    },
    getSummary(item) {
      return `Testimonial form submitted (${item.rating
        ? `${item.rating} stars`
        : "no rating"})`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.formId || item.form_id === this.formId)
        && (!this.minRating || this.getRating(item) >= Number(this.minRating));
    },
  },
  sampleEmit,
};
