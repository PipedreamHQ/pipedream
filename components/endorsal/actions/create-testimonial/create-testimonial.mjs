import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-create-testimonial",
  name: "Create Testimonial",
  description: "Creates a new testimonial. [See the documentation](https://developers.endorsal.io/docs/endorsal/b3a6mtcynteyoq-create-a-testimonial)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    endorsal,
    campaignId: {
      propDefinition: [
        endorsal,
        "campaignId",
      ],
    },
    contact: {
      propDefinition: [
        endorsal,
        "contact",
      ],
    },
    testimonial: {
      propDefinition: [
        endorsal,
        "testimonial",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.endorsal.createTestimonial(this.testimonial);
    $.export("$summary", `Successfully created testimonial with ID: ${response.id}`);
    return response;
  },
};
