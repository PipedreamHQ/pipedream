import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-list-testimonials",
  name: "List Testimonials",
  description: "Retrieves a list of testimonials received. [See the documentation](https://developers.endorsal.io/docs/endorsal/b3a6mtcynteyoa-retrieve-all-testimonials)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    endorsal,
  },
  async run({ $ }) {
    const testimonials = await this.endorsal.listTestimonials();
    $.export("$summary", `Successfully listed ${testimonials.data?.length} testimonials`);
    return testimonials;
  },
};
