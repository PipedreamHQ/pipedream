import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-replace-all-text",
  name: "Replace All Text",
  description: "Replace all text in a presentation. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#ReplaceAllTextRequest)",
  version: "0.0.1",
  type: "action",
  props: {
    googleSlides,
    presentationId: {
      propDefinition: [
        googleSlides,
        "presentationId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to replace",
    },
    replaceText: {
      type: "string",
      label: "Replace Text",
      description: "The text that will replace the matched text",
    },
    slideIds: {
      propDefinition: [
        googleSlides,
        "slideId",
        (c) => ({
          presentationId: c.presentationId,
        }),
      ],
      type: "string[]",
      label: "Slide IDs",
      description: "Limits the matches to page elements only on the given pages",
      optional: true,
    },
    matchCase: {
      type: "boolean",
      label: "Match Case",
      description: "Whether to match case",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.replaceAllText(this.presentationId, {
      replaceText: this.replaceText,
      pageObjectIds: this.slideIds,
      containsText: {
        text: this.text,
        matchCase: this.matchCase,
      },
    });
    $.export("$summary", "Successfully replaced text in the presentation");
    return response.data;
  },
};
