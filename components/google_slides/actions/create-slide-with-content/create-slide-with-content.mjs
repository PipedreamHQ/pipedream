import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-create-slide-with-content",
  name: "Create Slide With Content",
  description: "Create a slide from a layout and fill its title, subtitle and body placeholders in a single request, so the slide is never left empty. Prefer this over **Create Slide** followed by **Insert Text** when building a deck: it is one call per slide and needs no positioning. Pick a layout that has the placeholders you fill, e.g. `TITLE_AND_BODY` for a title and body, `TITLE` for a title and subtitle, or `TITLE_AND_TWO_COLUMNS` for a title and two bodies; if a placeholder is missing, the error lists the layouts in the deck. Create slides one at a time rather than in parallel. Returns the new slide's `slideId` and the `placeholders` it filled. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateSlideRequest)",
  version: "0.0.1",
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
        "staticPresentationId",
      ],
    },
    layout: {
      type: "string",
      label: "Layout",
      description: "The layout to base the slide on, given as its name (e.g. `TITLE_AND_BODY`), its display name (e.g. `Title and body`) or its object ID. Use **Get Presentation** and read `layouts[]` to see the layouts in a deck with a custom template.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Text for the slide's title placeholder (e.g. `Q3 Results`).",
      optional: true,
    },
    subtitle: {
      type: "string",
      label: "Subtitle",
      description: "Text for the slide's subtitle placeholder, found on title layouts such as `TITLE` (e.g. `Quarterly business review`).",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Text for the slide's first body placeholder. Separate paragraphs with a newline (e.g. `Revenue up 12%\\nChurn down 3%`).",
      optional: true,
    },
    secondBody: {
      type: "string",
      label: "Second Body",
      description: "Text for the slide's second body placeholder, such as the right-hand column of `TITLE_AND_TWO_COLUMNS` (e.g. `Next steps\\nHire two engineers`).",
      optional: true,
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
      layout,
      title,
      subtitle,
      body,
      secondBody,
      insertionIndex,
    } = this;
    const presentationId = googleSlides.getPresentationId(this.presentationId);

    // Each entry lists the placeholders it may fill, in order of preference.
    const content = [
      {
        label: "Title",
        text: title,
        targets: [
          {
            type: "TITLE",
            index: 0,
          },
          {
            type: "CENTERED_TITLE",
            index: 0,
          },
        ],
      },
      {
        label: "Subtitle",
        text: subtitle,
        targets: [
          {
            type: "SUBTITLE",
            index: 0,
          },
        ],
      },
      {
        label: "Body",
        text: body,
        targets: [
          {
            type: "BODY",
            index: 0,
          },
        ],
      },
      {
        label: "Second Body",
        text: secondBody,
        targets: [
          {
            type: "BODY",
            index: 1,
          },
        ],
      },
    ].filter(({ text }) => text);

    if (!content.length) {
      throw new ConfigurationError("Provide at least one of Title, Subtitle, Body or Second Body. To add an empty slide, use Create Slide.");
    }

    try {
      const {
        slideCount, layouts,
      } = await googleSlides.getSlideCreationContext(presentationId);
      googleSlides.validateInsertionIndex(insertionIndex, slideCount);

      const resolvedLayout = googleSlides.resolveLayout(layouts, layout);
      const layoutName = resolvedLayout.layoutProperties?.name || resolvedLayout.objectId;
      const slideId = googleSlides.newSlideObjectId();
      const placeholders = googleSlides.buildPlaceholderMappings(slideId, resolvedLayout);

      const filled = content.map(({
        label, text, targets,
      }) => {
        const placeholder = targets
          .map((target) => placeholders.find(({
            type, index,
          }) => type === target.type && index === target.index))
          .find(Boolean);
        if (!placeholder) {
          const available = placeholders.map(({
            type, index,
          }) => `${type} ${index}`).join(", ") || "none";
          throw new ConfigurationError(`Layout "${layoutName}" has no placeholder for ${label}. Its text placeholders are: ${available}. Choose a layout that has one, such as TITLE_AND_BODY.`);
        }
        return {
          ...placeholder,
          text,
        };
      });

      // Requests in one batch apply in order, so the text can target the
      // placeholder IDs assigned by createSlide.
      await googleSlides.batchUpdate(presentationId, [
        {
          createSlide: {
            objectId: slideId,
            insertionIndex,
            slideLayoutReference: {
              layoutId: resolvedLayout.objectId,
            },
            placeholderIdMappings: googleSlides.toPlaceholderIdMappings(placeholders),
          },
        },
        ...filled.map(({
          objectId, text,
        }) => ({
          insertText: {
            objectId,
            text,
          },
        })),
      ]);

      $.export("$summary", `Created slide ${slideId} using layout ${layoutName}, with ${filled.length} placeholder(s) filled`);

      return {
        presentationId,
        slideId,
        layoutId: resolvedLayout.objectId,
        layoutName,
        placeholders: filled.map(({
          type, index, objectId,
        }) => ({
          type,
          index,
          objectId,
        })),
      };
    } catch (error) {
      throw googleSlides.withPermissionHint(error);
    }
  },
};
