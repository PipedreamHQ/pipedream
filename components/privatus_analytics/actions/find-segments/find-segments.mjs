import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-segments",
  name: "Find Segments",
  description: "Lists the saved segments of a site. Use it to get the segment ID for **Get Site Stats**, **Get Time Series**, **Get Top Values** and **Create Export**. [See the documentation](https://privatusanalytics.com/docs/api)",
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
      path: `/sites/${utils.segment(this.siteId)}/segments.json`,
      params: utils.compact({}),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} segment${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
