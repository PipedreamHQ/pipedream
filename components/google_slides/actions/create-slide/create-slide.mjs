import googleSlides from "../../google_slides.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_slides-create-slide",
  name: "Create Slide",
  description: "Create a new slide in a presentation. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateSlideRequest)",
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
    layoutId: {
      propDefinition: [
        googleSlides,
        "layoutId",
        (c) => ({
          presentationId: c.presentationId,
        }),
      ],
    },
    insertionIndex: {
      type: "integer",
      label: "Insertion Index",
      description: "The optional zero-based index indicating where to insert the slides. If you don't specify an index, the slide is created at the end.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.googleSlides.createSlide(this.presentationId, {
        insertionIndex: this.insertionIndex,
        slideLayoutReference: {
          layoutId: this.layoutId,
        },
      });
      $.export("$summary", `Successfully created slide with ID: ${response.data.replies[0].createSlide.objectId}`);
      return response.data;
    } catch (error) {
      throw new ConfigurationError(`Failed to create slide: ${error.message}. Make sure you have permission to edit the presentation.`);
    }
  },
};
