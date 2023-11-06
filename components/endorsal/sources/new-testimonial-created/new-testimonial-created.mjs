import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-new-testimonial-created",
  name: "New Testimonial Created",
  description: "Emit new event when a new testimonial is created.",
  version: "0.0.{{{{ts}}}}",
  type: "source",
  dedupe: "unique",
  props: {
    endorsal,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getTestimonialId(testimonial) {
      return testimonial.id;
    },
  },
  hooks: {
    async deploy() {
      const testimonials = await this.endorsal.getTestimonials();
      const sortedTestimonials = testimonials.sort((a, b) => new Date(b.created) - new Date(a.created));
      const latestTestimonial = sortedTestimonials[0];
      this.db.set("latestTestimonialId", this._getTestimonialId(latestTestimonial));
    },
  },
  async run() {
    const testimonials = await this.endorsal.getTestimonials();
    const sortedTestimonials = testimonials.sort((a, b) => new Date(b.created) - new Date(a.created));
    const latestTestimonialId = this.db.get("latestTestimonialId");

    for (const testimonial of sortedTestimonials) {
      const testimonialId = this._getTestimonialId(testimonial);
      if (testimonialId === latestTestimonialId) {
        break;
      }
      this.$emit(testimonial, {
        id: testimonialId,
        summary: `New Testimonial: ${testimonial.title}`,
        ts: Date.parse(testimonial.created),
      });
    }

    this.db.set("latestTestimonialId", this._getTestimonialId(sortedTestimonials[0]));
  },
};
