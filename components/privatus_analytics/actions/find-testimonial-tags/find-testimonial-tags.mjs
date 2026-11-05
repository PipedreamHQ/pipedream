import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-testimonial-tags",
  name: "Find Testimonial Tags",
  description: "Lists the testimonial tags of a site, or finds one by name. Use it to get the tag IDs for **Find Testimonials**. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    query: {
      type: "string",
      label: "Name",
      description: "Part of the tag name, e.g. `onboarding`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "name (the default), used (most used first) or newest.",
      options: [
        "name",
        "used",
        "newest",
      ],
      default: "name",
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
      path: `/sites/${utils.segment(this.siteId)}/testimonials/tags.json`,
      params: utils.compact({
        query: this.query,
        sort: this.sort,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} tag${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
