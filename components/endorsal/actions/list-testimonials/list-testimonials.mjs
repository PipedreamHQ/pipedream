import endorsal from "../../endorsal.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "endorsal-list-testimonials",
  name: "List Testimonials",
  description: "Retrieves a list of testimonials received. [See the documentation](https://developers.endorsal.io/docs/endorsal/b3a6mtcynteyoa-retrieve-all-testimonials)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    endorsal,
  },
  async run({ $ }) {
    const testimonials = await this.endorsal.getTestimonials();
    $.export("$summary", `Successfully listed ${testimonials.length} testimonials`);
    return testimonials;
  },
};
