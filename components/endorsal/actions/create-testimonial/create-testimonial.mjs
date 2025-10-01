import {
  APPROVED_OPTIONS, FEATURED_OPTIONS,
} from "../../common/constants.mjs";
import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-create-testimonial",
  name: "Create Testimonial",
  description: "Creates a new testimonial. [See the documentation](https://developers.endorsal.io/docs/endorsal/b3a6mtcynteyoq-create-a-testimonial)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    endorsal,
    name: {
      propDefinition: [
        endorsal,
        "name",
      ],
      description: "The name of the testimonial.",
    },
    propertyID: {
      type: "string",
      label: "Property ID",
      description: "The ID of the property shown in the URL in the [Property Settings -> Edit](https://app.endorsal.io/property/settings).",
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "The comments of the testimonial.",
    },
    rating: {
      type: "integer",
      label: "Rating",
      description: "The rating of the testimonial. From 1 to 5.",
      min: 1,
      max: 5,
      optional: true,
    },
    avatar: {
      propDefinition: [
        endorsal,
        "avatar",
      ],
      description: "URL to publicly accessible image file.",
      optional: true,
    },
    email: {
      propDefinition: [
        endorsal,
        "email",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        endorsal,
        "location",
      ],
      optional: true,
    },
    position: {
      propDefinition: [
        endorsal,
        "position",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        endorsal,
        "company",
      ],
      optional: true,
    },
    approved: {
      type: "string",
      label: "Approved",
      description: "The status of the testimonial.",
      optional: true,
      options: APPROVED_OPTIONS,
    },
    featured: {
      type: "string",
      label: "Featured",
      description: "Whether the testimonial is featured or not.",
      optional: true,
      options: FEATURED_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      endorsal,
      approved,
      featured,
      ...data
    } = this;

    const response = await endorsal.createTestimonial({
      data: {
        approved: approved && parseInt(approved),
        featured: featured && parseInt(featured),
        added: Date.parse(new Date()),
        ...data,
      },
    });

    $.export("$summary", `Successfully created testimonial with ID: ${response.data?._id}`);
    return response;
  },
};
