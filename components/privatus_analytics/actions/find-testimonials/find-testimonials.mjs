import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-testimonials",
  name: "Find Testimonials",
  description: "Finds testimonials of a site by their words, status, rating, tag or form, newest first. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": true,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    q: {
      type: "string",
      label: "Search",
      description: "Words in the testimonial or the name or company of the person.",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Any of pending, approved, rejected.",
      options: [
        "pending",
        "approved",
        "rejected",
      ],
      optional: true,
    },
    minRating: {
      propDefinition: [
        app,
        "minRating",
      ],
    },
    kind: {
      type: "string[]",
      label: "Kind",
      description: "Any of text, video, audio.",
      options: [
        "text",
        "video",
        "audio",
      ],
      optional: true,
    },
    tagId: {
      propDefinition: [
        app,
        "testimonialTagIds",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    formId: {
      propDefinition: [
        app,
        "testimonialFormIds",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    receivedFrom: {
      type: "string",
      label: "Received From",
      description: "The first day received, as `YYYY-MM-DD`.",
      optional: true,
    },
    receivedTo: {
      type: "string",
      label: "Received To",
      description: "The last day received, as `YYYY-MM-DD`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The order of the results, e.g. `received_desc` for the newest received first. `relevance` needs a **Search**.",
      options: [
        "received_desc",
        "received_asc",
        "added_desc",
        "added_asc",
        "rating_desc",
        "rating_asc",
        "person_asc",
        "relevance",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    let items = await this.app.paginate({
      $,
      path: `/sites/${utils.segment(this.siteId)}/testimonials.json`,
      params: utils.compact({
        q: this.q,
        status: utils.toList(this.status),
        kind: utils.toList(this.kind),
        tag_id: utils.toList(this.tagId),
        form_id: utils.toList(this.formId),
        received_from: utils.toDate(this.receivedFrom),
        received_to: utils.toDate(this.receivedTo),
        sort: this.sort,
        rating: this.minRating
          ? [
            "1",
            "2",
            "3",
            "4",
            "5",
          ].filter((rating) => Number(rating) >= Number(this.minRating))
          : undefined,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} testimonial${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
