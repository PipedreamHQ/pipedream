import app from "../../google_slides.app.mjs";

export default {
  key: "google_slides-get-presentation",
  name: "Get Presentation",
  description: "Get a Google Slides presentation by its ID. Returns the presentation's metadata and structure (title, slides, masters, layouts, page size, etc.) according to requested `fields`. Use **Find a Presentation** first to resolve a presentation's name to its ID. [See the documentation](https://developers.google.com/slides/api/reference/rest/v1/presentations/get)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    presentationId: {
      type: "string",
      label: "Presentation ID",
      description: "The ID of the presentation to retrieve. This is the long string in the presentation's URL: `https://docs.google.com/presentation/d/{PRESENTATION_ID}/edit`. You can also paste the full URL. Use **Find a Presentation** to resolve a presentation's name to its ID.",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Optional partial-response [field mask](https://developers.google.com/slides/api/guides/field-masks) to limit the response to specific fields. Comma-separated, e.g. `presentationId,title` for just basic metadata, or `slides.objectId,title` to also list slide IDs. Omit to return the full presentation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const presentationId = this.app.getPresentationId(this.presentationId);
    const presentation = await this.app.getPresentation(presentationId, this.fields);
    $.export("$summary", `Successfully retrieved presentation with ID: ${presentationId}`);
    return presentation;
  },
};
