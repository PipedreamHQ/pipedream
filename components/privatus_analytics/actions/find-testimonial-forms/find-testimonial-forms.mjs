import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-testimonial-forms",
  name: "Find Testimonial Forms",
  description: "Lists the testimonial forms of a site, or finds one by name or slug. Use it to get the form IDs for **Find Testimonials** and the testimonial sources. [See the documentation](https://privatusanalytics.com/docs/api)",
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
      description: "Part of the name or slug of the form, e.g. `customer-stories`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Only forms in this language, e.g. de.",
      options: [
        "en",
        "de",
        "es",
        "fr",
        "it",
        "nl",
        "pt",
        "pl",
        "sv",
        "da",
        "no",
        "fi",
        "ja",
        "ko",
        "zh-CN",
        "zh-TW",
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
      path: `/sites/${utils.segment(this.siteId)}/testimonials/forms.json`,
      params: utils.compact({
        q: this.q,
        language: this.language,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} testimonial form${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
