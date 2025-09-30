import app from "../../trust.app.mjs";

export default {
  key: "trust-create-testimonial",
  name: "Create Testimonial",
  description: "Create a new testimonial within the Trust platform.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    videoToken: {
      propDefinition: [
        app,
        "videoToken",
      ],
    },
    videoUrl: {
      propDefinition: [
        app,
        "videoUrl",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    imageUrl: {
      propDefinition: [
        app,
        "imageUrl",
      ],
    },
    testimonialText: {
      propDefinition: [
        app,
        "testimonialText",
      ],
    },
    gaveConsent: {
      propDefinition: [
        app,
        "gaveConsent",
      ],
    },
    published: {
      propDefinition: [
        app,
        "published",
      ],
    },
    stars: {
      propDefinition: [
        app,
        "stars",
      ],
    },
  },
  methods: {
    createTestimonial(args = {}) {
      return this.app.post({
        path: "/testimonial",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createTestimonial,
      testimonialText,
      brandId,
      imageUrl,
      email,
      videoUrl,
      videoToken,
      firstName,
      lastName,
      title,
      gaveConsent,
      published,
      stars,
    } = this;

    const response = await createTestimonial({
      $,
      data: {
        brandId,
        testimonialText,
        imageUrl,
        email,
        videoUrl,
        videoToken,
        firstname: firstName,
        lastname: lastName,
        title,
        gaveConsent,
        published,
        stars,
      },
    });
    $.export("$summary", `Successfully created testimonial with ID \`${response.id}\`.`);
    return response;
  },
};
