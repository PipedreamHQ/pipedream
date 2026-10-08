import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-replace-all-text",
  name: "Replace All Text",
  description: "Replace every occurrence of a piece of text across a presentation, or only on the given slides. Useful for filling `{{placeholder}}` tokens in a template deck. The summary and `replies[0].replaceAllText.occurrencesChanged` report how many occurrences were replaced; `0` means nothing matched and the presentation was not changed. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#ReplaceAllTextRequest)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
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
    text: {
      type: "string",
      label: "Text",
      description: "The text to search for (e.g. `{{client_name}}`).",
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
      description: "Only replace text on these slides. If omitted, the whole presentation is searched.",
      optional: true,
    },
    matchCase: {
      type: "boolean",
      label: "Match Case",
      description: "Whether the search is case-sensitive. Defaults to `false`.",
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
    // Google omits zero-valued fields, so a missing count means nothing matched.
    const occurrencesChanged = response.data.replies?.[0]?.replaceAllText?.occurrencesChanged ?? 0;
    $.export("$summary", occurrencesChanged
      ? `Replaced ${occurrencesChanged} occurrence(s) of "${this.text}"`
      : `No occurrences of "${this.text}" were found, so nothing was replaced`);
    return response.data;
  },
};
