import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-create-slide",
  name: "Create Slide",
  description: "Create a new, empty slide in a presentation from one of its layouts. Returns the new slide's `objectId` and a `placeholders` array (`type`, `index`, `objectId`) for each title, subtitle and body placeholder on it, so text can go straight in with **Insert Text** without looking the slide up first. To create a slide and fill its title and body in one call, use **Create Slide With Content** instead. Always set `Layout ID`: without it the slide uses the BLANK layout and has no placeholders. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateSlideRequest)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "The zero-based position to insert the slide at (e.g. `0` for the first slide). Must not exceed the current number of slides. If omitted, the slide is added at the end.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleSlides,
      layoutId,
      insertionIndex,
    } = this;
    const presentationId = googleSlides.getPresentationId(this.presentationId);

    const objectId = googleSlides.newSlideObjectId();
    const request = {
      objectId,
      insertionIndex,
    };
    let placeholders = [];

    try {
      if (layoutId || insertionIndex != null) {
        const {
          slideCount, layouts,
        } = await googleSlides.getSlideCreationContext(presentationId);
        googleSlides.validateInsertionIndex(insertionIndex, slideCount);
        if (layoutId) {
          const layout = googleSlides.resolveLayout(layouts, layoutId);
          placeholders = googleSlides.buildPlaceholderMappings(objectId, layout);
          request.slideLayoutReference = {
            layoutId: layout.objectId,
          };
          request.placeholderIdMappings = googleSlides.toPlaceholderIdMappings(placeholders);
        }
      }

      const response = await googleSlides.createSlide(presentationId, request);

      $.export("$summary", layoutId
        ? `Successfully created slide with ID: ${objectId}`
        : `Created slide ${objectId} with the BLANK layout. It has no placeholders, so set Layout ID to get title and body placeholders.`);

      return {
        ...response.data,
        placeholders,
      };
    } catch (error) {
      throw googleSlides.withPermissionHint(error);
    }
  },
};
