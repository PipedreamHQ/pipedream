import app from "../../trust.app.mjs";

export default {
  key: "trust-update-testimonial",
  name: "Update Testimonial",
  description: "Update an existing testimonial within the Trust platform. [See the documentation](https://api-docs.usetrust.io/)",
  version: "0.0.1",
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
    email: {
      propDefinition: [
        app,
        "email",
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
    updateTestimonial({
      testimonialId, ...args
    } = {}) {
      return this.app.put({
        path: `/testimonial/${testimonialId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateTestimonial,
      brandId,
      testimonialId,
      testimonialText,
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

    const response = await updateTestimonial({
      $,
      testimonialId,
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
    $.export("$summary", `Successfully updated testimonial with ID \`${response.id}\`.`);
    return response;
  },
};
