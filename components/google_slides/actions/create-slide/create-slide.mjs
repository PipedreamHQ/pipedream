import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-create-slide",
  name: "Create Slide",
  description: "Create a slide from one of the presentation's layouts and, optionally, fill its title, subtitle and body placeholders in the same request. When building a deck, set `Layout` and the text in one call per slide instead of following up with **Insert Text**: no positioning is needed. Pick a layout that has the placeholders you fill, e.g. `TITLE_AND_BODY` for a title and body, `TITLE` for a title and subtitle, or `TITLE_AND_TWO_COLUMNS` for a title and two bodies; if a placeholder is missing, the error lists the ones the layout has. Without `Layout` the slide uses the BLANK layout and cannot take text. Create slides one at a time rather than in parallel. Returns the new slide's `objectId` and a `placeholders` array (`type`, `index`, `objectId`, `filled`) for each title, subtitle and body placeholder, so unfilled ones can be written later with **Insert Text**. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateSlideRequest)",
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
        "staticPresentationId",
      ],
    },
    layoutId: {
      propDefinition: [
        googleSlides,
        "layoutId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Text for the slide's title placeholder (e.g. `Q3 Results`). Requires `Layout`.",
      optional: true,
    },
    subtitle: {
      type: "string",
      label: "Subtitle",
      description: "Text for the slide's subtitle placeholder, found on title layouts such as `TITLE` (e.g. `Quarterly business review`). Requires `Layout`.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Text for the slide's first body placeholder (e.g. `Revenue grew 20% YoY\\nExpansion into 3 new markets`). Put each paragraph on its own line; a literal `\\n` is also treated as a line break. Requires `Layout`.",
      optional: true,
    },
    secondBody: {
      type: "string",
      label: "Second Body",
      description: "Text for the slide's second body placeholder, such as the right-hand column of `TITLE_AND_TWO_COLUMNS` (e.g. `Next steps`). Put each paragraph on its own line; a literal `\\n` is also treated as a line break. Requires `Layout`.",
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
      layoutId,
      title,
      subtitle,
      body,
      secondBody,
      insertionIndex,
    } = this;
    const presentationId = googleSlides.getPresentationId(this.presentationId);

    // Callers often send an escaped `\n` instead of a real line break.
    const toParagraphs = (text) => text?.replace(/\\n/g, "\n");

    // Each entry lists the placeholders it may fill, in order of preference.
    const content = [
      {
        label: "Title",
        text: title,
        targets: [
          {
            type: "TITLE",
            ordinal: 0,
          },
          {
            type: "CENTERED_TITLE",
            ordinal: 0,
          },
        ],
      },
      {
        label: "Subtitle",
        text: subtitle,
        targets: [
          {
            type: "SUBTITLE",
            ordinal: 0,
          },
        ],
      },
      {
        label: "Body",
        text: toParagraphs(body),
        targets: [
          {
            type: "BODY",
            ordinal: 0,
          },
        ],
      },
      {
        label: "Second Body",
        text: toParagraphs(secondBody),
        targets: [
          {
            type: "BODY",
            ordinal: 1,
          },
        ],
      },
    ].filter(({ text }) => text);

    if (content.length && !layoutId) {
      throw new ConfigurationError("Set Layout (e.g. `TITLE_AND_BODY`) to fill Title, Subtitle, Body or Second Body. Without it the slide uses the BLANK layout, which has no placeholders.");
    }

    const objectId = googleSlides.newSlideObjectId();
    const request = {
      objectId,
      insertionIndex,
    };
    let placeholders = [];
    let filled = [];
    let layoutName;

    try {
      if (layoutId || insertionIndex != null) {
        const {
          slideCount, layouts, masterUsage,
        } = await googleSlides.getSlideCreationContext(presentationId);
        googleSlides.validateInsertionIndex(insertionIndex, slideCount);
        if (layoutId) {
          const layout = googleSlides.resolveLayout(layouts, layoutId, masterUsage);
          layoutName = layout.layoutProperties?.name || layout.objectId;
          placeholders = googleSlides.buildPlaceholderMappings(objectId, layout);
          request.slideLayoutReference = {
            layoutId: layout.objectId,
          };
          request.placeholderIdMappings = googleSlides.toPlaceholderIdMappings(placeholders);
        }
      }

      filled = content.map(({
        label, text, targets,
      }) => {
        const placeholder = targets
          .map((target) => placeholders.find(({
            type, ordinal,
          }) => type === target.type && ordinal === target.ordinal))
          .find(Boolean);
        if (!placeholder) {
          const available = placeholders.map(({
            type, index,
          }) => `${type} ${index}`).join(", ") || "none";
          throw new ConfigurationError(`Layout "${layoutName}" has no placeholder for ${label}. Its text placeholders are: ${available}. Choose a layout that has one, such as TITLE_AND_BODY.`);
        }
        return {
          objectId: placeholder.objectId,
          text,
        };
      });

      // Requests in one batch apply in order, so the text can target the
      // placeholder IDs assigned by createSlide.
      const response = await googleSlides.batchUpdate(presentationId, [
        {
          createSlide: request,
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

      $.export("$summary", !layoutId
        ? `Created slide ${objectId} with the BLANK layout. It has no placeholders, so set Layout to get title and body placeholders.`
        : `Created slide ${objectId} using layout ${layoutName}${filled.length
          ? `, with ${filled.length} placeholder(s) filled`
          : ""}`);

      const filledIds = new Set(filled.map(({ objectId }) => objectId));
      return {
        ...response.data,
        placeholders: placeholders.map(({
          type, index, objectId,
        }) => ({
          type,
          index,
          objectId,
          filled: filledIds.has(objectId),
        })),
      };
    } catch (error) {
      throw googleSlides.withPermissionHint(error);
    }
  },
};
