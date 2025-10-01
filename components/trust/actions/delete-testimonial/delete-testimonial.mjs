import app from "../../trust.app.mjs";

export default {
  key: "trust-delete-testimonial",
  name: "Delete Testimonial",
  description: "Deletes an existing testimonial from the Trust platform. [See the documentation](https://api-docs.usetrust.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    brandId: {
      propDefinition: [
        app,
        "brandId",
      ],
    },
    testimonialId: {
      propDefinition: [
        app,
        "testimonialId",
        ({ brandId }) => ({
          brandId,
        }),
      ],
    },
  },
  methods: {
    deleteTestimonial({
      testimonialId, ...args
    } = {}) {
      return this.app.delete({
        path: `/testimonial/${testimonialId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteTestimonial,
      testimonialId,
    } = this;

    await deleteTestimonial({
      $,
      testimonialId,
    });

    $.export("$summary", "Successfully deleted testimonial.");

    return {
      success: true,
    };
  },
};
