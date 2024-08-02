import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trust-new-testimonial",
  name: "New Testimonial Created",
  description: "Emit new event when a new testimonial is created. [See the documentation](https://api-docs.usetrust.io/get-a-list-with-testimonials-for-a-specific-website-via-brand-id).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    brandId: {
      propDefinition: [
        common.props.app,
        "brandId",
      ],
    },
  },
  methods: {
    ...common.methods,
    sortFn(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    },
    getResourcesFn() {
      return this.app.listTestimonials;
    },
    getResourcesFnArgs() {
      return {
        brandId: this.brandId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Testimonial: ${resource.id}`,
        ts: Date.parse(resource.created),
      };
    },
  },
  sampleEmit,
};
