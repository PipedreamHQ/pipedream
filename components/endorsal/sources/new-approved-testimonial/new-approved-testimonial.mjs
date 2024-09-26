import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-new-approved-testimonial",
  name: "New Approved Testimonial",
  description: "Emit new event when a new testimonial is approved.",
  version: "0.0.1",
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
    _getSentIds() {
      return this.db.get("sentIds") || [];
    },
    _setSentIds(sentIds) {
      return this.db.set("sentIds", sentIds);
    },
    async startEvent(maxResults = false) {
      const { data } = await this.endorsal.listTestimonials();
      let sortedTestimonials = data.sort((a, b) => b.added - a.added);
      const sentIds = this._getSentIds();
      const filteredItems  = sortedTestimonials.filter((item) => !sentIds.includes(item._id));
      if (maxResults && (filteredItems.length >= maxResults)) filteredItems.length = maxResults;

      for (const testimonial of filteredItems.reverse()) {
        this.$emit(testimonial, {
          id: testimonial._id,
          summary: `New Testimonial Approved: ${testimonial._id}`,
          ts: testimonial.added,
        });
      }
      const newIds = sortedTestimonials.map((item) => item._id);

      this._setSentIds(newIds);
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
