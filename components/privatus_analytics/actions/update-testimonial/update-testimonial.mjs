import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-update-testimonial",
  name: "Update Testimonial",
  description: "Changes the words, rating, tags, custom properties and more of a testimonial. Only the fields filled in are changed. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    testimonialId: {
      propDefinition: [
        app,
        "testimonialId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    body: {
      type: "string",
      label: "Text",
      description: "The words. A change is kept in the history.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Up to 200 characters. A change is kept in the history.",
      optional: true,
    },
    rating: {
      type: "integer",
      label: "Rating",
      description: "The stars, 1 to 5, e.g. `4`. To remove the rating use **Clear Rating** instead. A change is kept in the history.",
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      optional: true,
    },
    clearRating: {
      type: "boolean",
      label: "Clear Rating",
      description: "Whether to remove the rating. Turn it on to send no rating at all. Do not use it together with **Rating**.",
      optional: true,
    },
    highlight: {
      type: "string",
      label: "Highlight",
      description: "An exact part of the words to highlight, e.g. `saved us hours every week`. To remove the highlight use **Clear Highlight** instead.",
      optional: true,
    },
    clearHighlight: {
      type: "boolean",
      label: "Clear Highlight",
      description: "Whether to remove the highlight. Do not use it together with **Highlight**.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code.",
      optional: true,
    },
    receivedAt: {
      type: "string",
      label: "Received At",
      description: "When they gave it. A day alone (2026-10-10) is that day by the site's clock.",
      optional: true,
    },
    sourceName: {
      type: "string",
      label: "Source Name",
      description: "The platform or place it came from.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "A public link to it.",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Custom property values to change, by key, like `{\"plan\":\"pro\"}`. A key set to an empty value is cleared.",
      optional: true,
    },
    addTags: {
      type: "string[]",
      label: "Add Tags",
      description: "Tag names or IDs to add. A name that does not exist yet is created.",
      optional: true,
    },
    removeTags: {
      type: "string[]",
      label: "Remove Tags",
      description: "Tag names or IDs to remove.",
      optional: true,
    },
    editNote: {
      type: "string",
      label: "Edit Note",
      description: "A line kept with the history entry, up to 280 characters.",
      optional: true,
    },
    permalink: {
      type: "boolean",
      label: "Public Page",
      description: "Switches its public page (/t/<tm_id>) on or off. The page responds only while the testimonial is approved, not in the trash and allowed by its consent record.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = utils.compact({
      body: this.body,
      title: this.title,
      rating: this.rating
        ? parseInt(this.rating, 10)
        : undefined,
      highlight: this.highlight,
      language: this.language,
      received_at: this.receivedAt,
      source_name: this.sourceName,
      source_url: this.sourceUrl,
      properties: this.properties,
      add_tags: utils.toList(this.addTags),
      remove_tags: utils.toList(this.removeTags),
      edit_note: this.editNote,
      permalink: this.permalink,
    });
    if (this.clearRating) data.rating = null;
    if (this.clearHighlight) data.highlight = null;
    const response = await this.app.request({
      $,
      method: "PATCH",
      path: `/sites/${utils.segment(this.siteId)}/testimonials/${utils.segment(this.testimonialId)}.json`,
      data: data,
    });
    $.export("$summary", `Successfully updated testimonial ${this.testimonialId}`);
    return response;
  },
};
