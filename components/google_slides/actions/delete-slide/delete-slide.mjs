import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-delete-slide",
  name: "Delete Slide",
  description: "Deletes a slide from a presentation. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#DeleteObjectRequest)",
  version: "0.0.2",
  type: "action",
  props: {
    googleSlides,
    presentationId: {
      propDefinition: [
        googleSlides,
        "presentationId",
      ],
    },
    slideId: {
      propDefinition: [
        googleSlides,
        "slideId",
        (c) => ({
          presentationId: c.presentationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.deleteObject(this.presentationId, this.slideId);
    $.export("$summary", `Successfully deleted slide with ID: ${this.slideId}`);
    return response.data;
  },
};
