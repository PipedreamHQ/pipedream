import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-get-live-visitors",
  name: "Get Live Visitors",
  description: "Gets how many visitors are on a site right now (the last 30 minutes) and its latest activity. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
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
    feed: {
      type: "string",
      label: "Feed",
      description: "Which hits to put in the activity feed: all (default), pageviews or events.",
      options: [
        "all",
        "pageviews",
        "events",
      ],
      default: "all",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Feed entries to return, 1 to 100. Default 50.",
      default: 10,
      optional: true,
    },
    filters: {
      propDefinition: [
        app,
        "filters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "GET",
      path: `/sites/${utils.segment(this.siteId)}/live.json`,
      params: utils.compact({
        feed: this.feed,
        limit: this.limit,
        filters: utils.parseJson(this.filters, "Filters"),
      }),
    });
    $.export("$summary", `${response.live_visitors} visitor${response.live_visitors === 1
      ? ""
      : "s"} on the site right now`);
    return response;
  },
};
