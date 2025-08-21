import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-delete-page-element",
  name: "Delete Page Element",
  description: "Deletes a page element from a slide. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#DeleteObjectRequest)",
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
    pageElementId: {
      propDefinition: [
        googleSlides,
        "shapeId",
        (c) => ({
          presentationId: c.presentationId,
          slideId: c.slideId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.deleteObject(this.presentationId, this.pageElementId);
    $.export("$summary", `Successfully deleted page element with ID: ${this.pageElementId}`);
    return response.data;
  },
};
