import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-testimonial-collections",
  name: "Find Testimonial Collections",
  description: "Lists the testimonial collections of a site, or finds one by name. Use it to get the collection IDs for **Create Testimonial**. [See the documentation](https://privatusanalytics.com/docs/api)",
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
      description: "Part of the collection name, e.g. `homepage`.",
      optional: true,
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "manual or smart.",
      options: [
        "manual",
        "smart",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "name (the default), updated (most recently changed first) or size (most testimonials first).",
      options: [
        "name",
        "updated",
        "size",
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
      path: `/sites/${utils.segment(this.siteId)}/testimonials/collections.json`,
      params: utils.compact({
        query: this.query,
        kind: this.kind,
        sort: this.sort,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} collection${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
